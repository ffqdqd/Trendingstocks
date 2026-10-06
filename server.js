// 주식 트렌드 알림 — 실데이터 백엔드 서버
// 데이터 소스:
//   - Yahoo Finance chart API (시세·차트·52주 고저)
//   - Google News RSS (종목별 뉴스·핫 키워드)
// 정적 자원: /  → prototype/index.html
// API:
//   GET  /api/indices                       KOSPI + KOSDAQ 지수
//   GET  /api/search?q=...                  종목 검색 (한글명·코드)
//   GET  /api/stock/:code                   시세 + 차트 + 지지/저항/목표 분석
//   GET  /api/stock/:code/news              종목 관련 최신 뉴스
//   GET  /api/market/movers                 오늘의 상승률 TOP
//   GET  /api/hot-keywords                  오늘의 핫 키워드
//   POST /api/watchlist/quotes              [{code}]  → [{code, price, change, ...}]
//   POST /api/watchlist/news                [{code}]  → 최근 뉴스 3건씩 merge
// -----------------------------------------------------------------------------

import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import iconv from 'iconv-lite';
import { KR_STOCKS as BUNDLED_STOCKS, searchStocks as searchBundled, findByCode as findBundledByCode } from './data/korean-stocks.js';

// ---------- Dynamic KRX master (KOSPI + KOSDAQ ~2,500 종목) ----------
// KRX 상장법인 목록을 서버 시작 시 fetch → 캐시. 하루 1회 갱신.
let KR_STOCKS = [...BUNDLED_STOCKS];
let stockMap = new Map(KR_STOCKS.map(s => [s.code, s]));
let krxLoadedAt = 0;

async function loadKrxMaster() {
  try {
    console.log('[KRX] 상장법인 목록 로드 중...');
    const [kospi, kosdaq] = await Promise.all([
      fetchKrxMarket('stockMkt', 'KOSPI'),
      fetchKrxMarket('kosdaqMkt', 'KOSDAQ'),
    ]);
    const merged = new Map();
    // 번들 우선 (sector 정보 있음)
    BUNDLED_STOCKS.forEach(s => merged.set(s.code, s));
    // KRX 데이터로 확장
    [...kospi, ...kosdaq].forEach(s => {
      if (!merged.has(s.code)) merged.set(s.code, s);
      else {
        // 기존 번들에 sector 있으면 유지, 없으면 KRX 값 사용
        const existing = merged.get(s.code);
        if (!existing.sector && s.sector) existing.sector = s.sector;
      }
    });
    KR_STOCKS = [...merged.values()];
    stockMap = new Map(KR_STOCKS.map(s => [s.code, s]));
    krxLoadedAt = Date.now();
    console.log(`[KRX] 완료 · KOSPI ${kospi.length} + KOSDAQ ${kosdaq.length} → 총 ${KR_STOCKS.length}종목`);
  } catch (e) {
    console.error('[KRX] 로드 실패, 번들 리스트로 계속:', e.message);
  }
}

async function fetchKrxMarket(marketType, marketLabel) {
  const url = `https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13&marketType=${marketType}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`KRX ${marketLabel}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const html = iconv.decode(buf, 'euc-kr');
  return parseKrxHtml(html, marketLabel);
}

function parseKrxHtml(html, market) {
  // 각 <tr> 안: 회사명 · 종목구분 · 종목코드 · 업종 · 주요제품 · 상장일 · 결산월 · 대표자명 · 홈페이지
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let m;
  while ((m = trRe.exec(html))) {
    const cells = [];
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/g;
    let c;
    while ((c = tdRe.exec(m[1]))) {
      const txt = c[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
      cells.push(txt);
    }
    if (cells.length < 5) continue;
    const name = cells[0];
    const code = cells[2];
    const sector = cells[3] || '';
    if (!/^\d{6}$/.test(code)) continue;
    rows.push({
      code, name, market,
      sector,
      yahoo: `${code}.${market === 'KOSPI' ? 'KS' : 'KQ'}`,
    });
  }
  return rows;
}

// 로컬 검색 헬퍼 (확장 리스트 대상)
function searchStocks(query, limit = 10) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const s of KR_STOCKS) {
    const nameLower = s.name.toLowerCase();
    let score = 0;
    if (s.code === q) score = 100;
    else if (s.code.startsWith(q)) score = 90;
    else if (nameLower === q) score = 85;
    else if (nameLower.startsWith(q)) score = 80;
    else if (nameLower.includes(q)) score = 60;
    else if (s.sector && s.sector.toLowerCase().includes(q)) score = 30;
    if (score) scored.push({ ...s, score });
    if (scored.length > limit * 4) break;
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ score, ...rest }) => rest);
}

function findByCode(code) {
  return stockMap.get(code) || findBundledByCode(code);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

// ---------- Cache (60s TTL) ----------
const cache = new Map();
function cacheGet(key, ttlMs) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > ttlMs) { cache.delete(key); return null; }
  return hit.val;
}
function cacheSet(key, val) { cache.set(key, { val, at: Date.now() }); return val; }

// ---------- Yahoo Finance ----------
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function yahooChart(symbol, range = '3mo', interval = '1d') {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Yahoo chart ${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo chart ${symbol}: no data`);
  return result;
}

function analyzeChart(result, opts = {}) {
  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const closes = (quote.close || []).map(v => (v == null ? null : Math.round(v)));
  const highs  = (quote.high  || []).map(v => (v == null ? null : Math.round(v)));
  const lows   = (quote.low   || []).map(v => (v == null ? null : Math.round(v)));
  const opens  = (quote.open  || []).map(v => (v == null ? null : Math.round(v)));
  const volumes = quote.volume || [];
  const times  = (result.timestamp || []).map(t => t * 1000);

  const validCloses = closes.filter(v => v != null);
  const price = Math.round(meta.regularMarketPrice ?? validCloses.at(-1) ?? 0);
  // Yahoo 의 `fulldayChange` / `regularMarketChangePercent` 를 우선 사용 (일일 변동).
  // `chartPreviousClose` 는 조회 range 시작 전 종가라 6mo 요청 시 부정확함.
  const changeAmt = Math.round(meta.fulldayChange ?? (price - (validCloses.at(-2) ?? price)));
  const changePct = Number(meta.regularMarketChangePercent ?? meta.fulldayChangePercent ?? 0);
  const prevClose = price - changeAmt;

  const high52 = Math.round(meta.fiftyTwoWeekHigh ?? Math.max(...highs.filter(v => v != null)));
  const low52  = Math.round(meta.fiftyTwoWeekLow  ?? Math.min(...lows.filter(v => v != null)));

  // 최근 60일 고저 (거래일 기준 ~60개 종가/고저)
  const window = 60;
  const recentHighs = highs.slice(-window).filter(v => v != null);
  const recentLows  = lows.slice(-window).filter(v => v != null);
  const rHigh = recentHighs.length ? Math.max(...recentHighs) : high52;
  const rLow  = recentLows.length ? Math.min(...recentLows) : low52;

  // 지지선/저항선/손절선/목표가 산출 규칙
  // 지지선: 최근 60일 저점 근처를 primary 로 사용. 52주 최저가는 참고만 (액면분할 등 데이터 왜곡 회피)
  const support = {
    low: Math.round(rLow * 0.98),
    high: Math.round(rLow * 1.04),
  };
  // 저항선: 최근 60일 고점 근처. 현재가가 이미 rHigh 근처면 상단을 좀 더 넓게 잡음
  const resistance = {
    low: Math.round(rHigh * 0.98),
    high: Math.round(rHigh * 1.03),
  };
  const stopLoss = Math.round(support.low * 0.96);
  const target1  = Math.round(resistance.high * 1.05);
  const longTarget = Math.round(high52 * 1.00);
  const midTarget  = Math.round((resistance.high + high52) / 2);

  // 현재 위치 (지지↔저항 사이 %)
  const posPct = Math.max(0, Math.min(100, Math.round(
    ((price - support.low) / Math.max(1, resistance.high - support.low)) * 100
  )));

  return {
    price, prevClose, changeAmt, changePct,
    high52, low52,
    volume: meta.regularMarketVolume ?? volumes.at(-1) ?? 0,
    dayHigh: Math.round(meta.regularMarketDayHigh ?? 0),
    dayLow: Math.round(meta.regularMarketDayLow ?? 0),
    marketTime: meta.regularMarketTime ? meta.regularMarketTime * 1000 : null,
    currency: meta.currency || 'KRW',
    tradingHalted: !!meta.tradingHalted,
    support, resistance, stopLoss, target1, midTarget, longTarget,
    posPct,
    series: { times, opens, highs, lows, closes },
  };
}

// ---------- Google News RSS ----------
async function fetchGoogleNews(query, limit = 8) {
  const key = `news:${query}:${limit}`;
  const hit = cacheGet(key, 5 * 60 * 1000);
  if (hit) return hit;

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Google News: HTTP ${res.status}`);
  const xml = await res.text();

  // 간이 XML 파서 (item 블록 추출)
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) && items.length < limit) {
    const block = m[1];
    const pick = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
      const g = r.exec(block);
      return g ? g[1].trim() : '';
    };
    let title = pick('title');
    const link = pick('link');
    const pubDate = pick('pubDate');
    const source = pick('source');

    // "제목 - 출처" 분리
    let outlet = source;
    const dashIdx = title.lastIndexOf(' - ');
    if (dashIdx > 0) {
      if (!outlet) outlet = title.slice(dashIdx + 3).trim();
      title = title.slice(0, dashIdx).trim();
    }

    items.push({ title, link, pubDate, source: outlet });
  }
  return cacheSet(key, items);
}

// ---------- Routes ----------

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), stockCount: KR_STOCKS.length });
});

// KOSPI/KOSDAQ 지수
app.get('/api/indices', async (_req, res) => {
  try {
    const key = 'indices';
    const hit = cacheGet(key, 60 * 1000);
    if (hit) return res.json(hit);

    const [kospi, kosdaq] = await Promise.all([
      yahooChart('^KS11', '5d', '1d').catch(() => null),
      yahooChart('^KQ11', '5d', '1d').catch(() => null),
    ]);
    const pick = (r) => {
      if (!r) return null;
      const m = r.meta || {};
      return {
        name: m.longName || m.shortName || m.symbol,
        symbol: m.symbol,
        price: Number((m.regularMarketPrice ?? 0).toFixed(2)),
        change: Number((m.regularMarketPrice - m.chartPreviousClose).toFixed(2)),
        changePct: Number((m.regularMarketChangePercent ?? 0).toFixed(2)),
        marketTime: m.regularMarketTime ? m.regularMarketTime * 1000 : null,
        high52: m.fiftyTwoWeekHigh,
        low52: m.fiftyTwoWeekLow,
      };
    };
    const out = { kospi: pick(kospi), kosdaq: pick(kosdaq), fetchedAt: Date.now() };
    return res.json(cacheSet(key, out));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 종목 검색
app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ results: [] });
  const results = searchStocks(q, 10);
  return res.json({ results });
});

// 종목 상세 (시세+차트+분석)
app.get('/api/stock/:code', async (req, res) => {
  const code = String(req.params.code || '').trim();
  const master = findByCode(code);
  if (!master) return res.status(404).json({ error: `unknown stock code: ${code}` });

  try {
    const key = `stock:${master.yahoo}`;
    const hit = cacheGet(key, 60 * 1000);
    if (hit) return res.json(hit);

    const result = await yahooChart(master.yahoo, '6mo', '1d');
    const analysis = analyzeChart(result);
    const out = {
      code: master.code,
      name: master.name,
      market: master.market,
      sector: master.sector,
      yahoo: master.yahoo,
      ...analysis,
    };
    return res.json(cacheSet(key, out));
  } catch (e) {
    return res.status(502).json({ error: e.message, code });
  }
});

// 종목 뉴스
app.get('/api/stock/:code/news', async (req, res) => {
  const code = String(req.params.code || '').trim();
  const master = findByCode(code);
  if (!master) return res.status(404).json({ error: `unknown stock code: ${code}` });
  try {
    const items = await fetchGoogleNews(master.name + ' 주식', 8);
    return res.json({ code: master.code, name: master.name, items });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
});

// 오늘의 상승률 TOP (주요 종목 배치 조회 후 % 정렬)
app.get('/api/market/movers', async (_req, res) => {
  try {
    const key = 'movers';
    const hit = cacheGet(key, 2 * 60 * 1000);
    if (hit) return res.json(hit);

    // 상위 시총 30개 종목만 병렬 조회 (API 부담 완화)
    const sample = KR_STOCKS.slice(0, 60);
    const results = await Promise.all(sample.map(async s => {
      try {
        const r = await yahooChart(s.yahoo, '5d', '1d');
        const m = r.meta || {};
        const price = Math.round(m.regularMarketPrice ?? 0);
        const chg = Number((m.regularMarketChangePercent ?? 0).toFixed(2));
        return { code: s.code, name: s.name, market: s.market, sector: s.sector, price, changePct: chg };
      } catch { return null; }
    }));
    const valid = results.filter(Boolean);
    const gainers = [...valid].sort((a, b) => b.changePct - a.changePct).slice(0, 10);
    const losers  = [...valid].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
    const out = { gainers, losers, fetchedAt: Date.now() };
    return res.json(cacheSet(key, out));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 오늘의 핫 키워드 (curated queries + 실시간 헤드라인)
const HOT_KEYWORDS = [
  { key: '반도체', query: '반도체 주식', icon: '💾' },
  { key: '2차전지', query: '2차전지 주가', icon: '🔋' },
  { key: 'AI', query: 'AI 관련주', icon: '🤖' },
  { key: '방산', query: '방산주 급등', icon: '🛡️' },
  { key: '조선', query: '조선주 수주', icon: '🚢' },
  { key: '바이오', query: '바이오 주식', icon: '🧬' },
  { key: '금리', query: '금리 주식시장', icon: '💰' },
  { key: '환율', query: '원달러 환율 증시', icon: '💱' },
];
app.get('/api/hot-keywords', async (_req, res) => {
  try {
    const key = 'hot-keywords';
    const hit = cacheGet(key, 10 * 60 * 1000);
    if (hit) return res.json(hit);
    const enriched = await Promise.all(HOT_KEYWORDS.map(async kw => {
      try {
        const items = await fetchGoogleNews(kw.query, 3);
        return { ...kw, headlines: items };
      } catch { return { ...kw, headlines: [] }; }
    }));
    const out = { keywords: enriched, fetchedAt: Date.now() };
    return res.json(cacheSet(key, out));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 즐겨찾기 배치 시세
app.post('/api/watchlist/quotes', async (req, res) => {
  const codes = Array.isArray(req.body?.codes) ? req.body.codes : [];
  if (!codes.length) return res.json({ items: [] });
  const items = await Promise.all(codes.map(async code => {
    const master = findByCode(code);
    if (!master) return null;
    try {
      const cached = cacheGet(`stock:${master.yahoo}`, 60 * 1000);
      if (cached) {
        return {
          code: master.code, name: master.name, market: master.market, sector: master.sector,
          price: cached.price, changePct: cached.changePct, changeAmt: cached.changeAmt,
          support: cached.support, resistance: cached.resistance, stopLoss: cached.stopLoss,
          target1: cached.target1, longTarget: cached.longTarget,
          posPct: cached.posPct, marketTime: cached.marketTime,
        };
      }
      const r = await yahooChart(master.yahoo, '3mo', '1d');
      const a = analyzeChart(r);
      cacheSet(`stock:${master.yahoo}`, { code: master.code, name: master.name, market: master.market, sector: master.sector, yahoo: master.yahoo, ...a });
      return {
        code: master.code, name: master.name, market: master.market, sector: master.sector,
        price: a.price, changePct: a.changePct, changeAmt: a.changeAmt,
        support: a.support, resistance: a.resistance, stopLoss: a.stopLoss,
        target1: a.target1, longTarget: a.longTarget,
        posPct: a.posPct, marketTime: a.marketTime,
      };
    } catch (e) { return { code, error: e.message }; }
  }));
  return res.json({ items: items.filter(Boolean) });
});

// 즐겨찾기 뉴스 (여러 종목 뉴스를 최신순 merge)
app.post('/api/watchlist/news', async (req, res) => {
  const codes = Array.isArray(req.body?.codes) ? req.body.codes : [];
  if (!codes.length) return res.json({ items: [] });
  const bundles = await Promise.all(codes.map(async code => {
    const master = findByCode(code);
    if (!master) return [];
    try {
      const items = await fetchGoogleNews(master.name + ' 주식', 3);
      return items.map(it => ({ ...it, stockCode: master.code, stockName: master.name }));
    } catch { return []; }
  }));
  const merged = bundles.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 15);
  return res.json({ items: merged });
});

// ---------- Static ----------
app.use('/prototype', express.static(path.join(__dirname, 'prototype')));
app.get('/', (_req, res) => res.redirect('/prototype/'));
app.use(express.static(path.join(__dirname))); // docs, etc. (dev)

// ---------- Start ----------
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, async () => {
  console.log(`\n📈 주식 트렌드 알림 서버 실행 중`);
  console.log(`   ➜ http://localhost:${PORT}/`);
  console.log(`   ➜ API base: http://localhost:${PORT}/api`);
  console.log(`   ➜ 초기 종목 수: ${KR_STOCKS.length} (번들)`);
  await loadKrxMaster();
  console.log(`   ➜ 준비 완료: ${KR_STOCKS.length}종목\n`);
});
// 24시간마다 갱신
setInterval(loadKrxMaster, 24 * 60 * 60 * 1000);

// health 에 종목 수 반영
app.get('/api/master-status', (_req, res) => {
  res.json({ count: KR_STOCKS.length, loadedAt: krxLoadedAt });
});

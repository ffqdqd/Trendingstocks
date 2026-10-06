// Korean stock master list — top KOSPI/KOSDAQ by market cap
// code: 6-digit KRX ticker, market: KS(KOSPI)/KQ(KOSDAQ), yahoo: symbol used at Yahoo Finance
// Used for Korean-name search & default watchlist seeding.

export const KR_STOCKS = [
  // ===== KOSPI 대형주 =====
  { code: '005930', name: '삼성전자', market: 'KOSPI', sector: '반도체', yahoo: '005930.KS' },
  { code: '000660', name: 'SK하이닉스', market: 'KOSPI', sector: '반도체', yahoo: '000660.KS' },
  { code: '373220', name: 'LG에너지솔루션', market: 'KOSPI', sector: '2차전지', yahoo: '373220.KS' },
  { code: '207940', name: '삼성바이오로직스', market: 'KOSPI', sector: '바이오', yahoo: '207940.KS' },
  { code: '005380', name: '현대차', market: 'KOSPI', sector: '자동차', yahoo: '005380.KS' },
  { code: '005935', name: '삼성전자우', market: 'KOSPI', sector: '반도체', yahoo: '005935.KS' },
  { code: '000270', name: '기아', market: 'KOSPI', sector: '자동차', yahoo: '000270.KS' },
  { code: '068270', name: '셀트리온', market: 'KOSPI', sector: '바이오', yahoo: '068270.KS' },
  { code: '105560', name: 'KB금융', market: 'KOSPI', sector: '금융', yahoo: '105560.KS' },
  { code: '005490', name: 'POSCO홀딩스', market: 'KOSPI', sector: '철강', yahoo: '005490.KS' },
  { code: '035420', name: 'NAVER', market: 'KOSPI', sector: 'IT서비스', yahoo: '035420.KS' },
  { code: '012330', name: '현대모비스', market: 'KOSPI', sector: '자동차부품', yahoo: '012330.KS' },
  { code: '028260', name: '삼성물산', market: 'KOSPI', sector: '유통·건설', yahoo: '028260.KS' },
  { code: '055550', name: '신한지주', market: 'KOSPI', sector: '금융', yahoo: '055550.KS' },
  { code: '035720', name: '카카오', market: 'KOSPI', sector: 'IT서비스', yahoo: '035720.KS' },
  { code: '051910', name: 'LG화학', market: 'KOSPI', sector: '화학', yahoo: '051910.KS' },
  { code: '006400', name: '삼성SDI', market: 'KOSPI', sector: '2차전지', yahoo: '006400.KS' },
  { code: '086790', name: '하나금융지주', market: 'KOSPI', sector: '금융', yahoo: '086790.KS' },
  { code: '032830', name: '삼성생명', market: 'KOSPI', sector: '보험', yahoo: '032830.KS' },
  { code: '015760', name: '한국전력', market: 'KOSPI', sector: '전력', yahoo: '015760.KS' },
  { code: '017670', name: 'SK텔레콤', market: 'KOSPI', sector: '통신', yahoo: '017670.KS' },
  { code: '033780', name: 'KT&G', market: 'KOSPI', sector: '담배', yahoo: '033780.KS' },
  { code: '003550', name: 'LG', market: 'KOSPI', sector: '지주회사', yahoo: '003550.KS' },
  { code: '096770', name: 'SK이노베이션', market: 'KOSPI', sector: '정유·화학', yahoo: '096770.KS' },
  { code: '034730', name: 'SK', market: 'KOSPI', sector: '지주회사', yahoo: '034730.KS' },
  { code: '030200', name: 'KT', market: 'KOSPI', sector: '통신', yahoo: '030200.KS' },
  { code: '316140', name: '우리금융지주', market: 'KOSPI', sector: '금융', yahoo: '316140.KS' },
  { code: '018260', name: '삼성에스디에스', market: 'KOSPI', sector: 'IT서비스', yahoo: '018260.KS' },
  { code: '009150', name: '삼성전기', market: 'KOSPI', sector: '전자부품', yahoo: '009150.KS' },
  { code: '011200', name: 'HMM', market: 'KOSPI', sector: '해운', yahoo: '011200.KS' },
  { code: '024110', name: '기업은행', market: 'KOSPI', sector: '금융', yahoo: '024110.KS' },
  { code: '051900', name: 'LG생활건강', market: 'KOSPI', sector: '생활용품', yahoo: '051900.KS' },
  { code: '066570', name: 'LG전자', market: 'KOSPI', sector: '가전', yahoo: '066570.KS' },
  { code: '003670', name: '포스코퓨처엠', market: 'KOSPI', sector: '2차전지소재', yahoo: '003670.KS' },
  { code: '010130', name: '고려아연', market: 'KOSPI', sector: '비철금속', yahoo: '010130.KS' },
  { code: '267260', name: 'HD현대일렉트릭', market: 'KOSPI', sector: '전기·전자', yahoo: '267260.KS' },
  { code: '034020', name: '두산에너빌리티', market: 'KOSPI', sector: '기계·에너지', yahoo: '034020.KS' },
  { code: '064350', name: '현대로템', market: 'KOSPI', sector: '기계', yahoo: '064350.KS' },
  { code: '006260', name: 'LS', market: 'KOSPI', sector: '전선·전기', yahoo: '006260.KS' },
  { code: '010950', name: 'S-Oil', market: 'KOSPI', sector: '정유', yahoo: '010950.KS' },
  { code: '036570', name: '엔씨소프트', market: 'KOSPI', sector: '게임', yahoo: '036570.KS' },
  { code: '251270', name: '넷마블', market: 'KOSPI', sector: '게임', yahoo: '251270.KS' },
  { code: '090430', name: '아모레퍼시픽', market: 'KOSPI', sector: '화장품', yahoo: '090430.KS' },
  { code: '000810', name: '삼성화재', market: 'KOSPI', sector: '보험', yahoo: '000810.KS' },
  { code: '009540', name: 'HD한국조선해양', market: 'KOSPI', sector: '조선', yahoo: '009540.KS' },
  { code: '329180', name: 'HD현대중공업', market: 'KOSPI', sector: '조선', yahoo: '329180.KS' },
  { code: '042660', name: '한화오션', market: 'KOSPI', sector: '조선', yahoo: '042660.KS' },
  { code: '012450', name: '한화에어로스페이스', market: 'KOSPI', sector: '방산', yahoo: '012450.KS' },
  { code: '272210', name: '한화시스템', market: 'KOSPI', sector: '방산', yahoo: '272210.KS' },
  { code: '047810', name: '한국항공우주', market: 'KOSPI', sector: '방산', yahoo: '047810.KS' },
  { code: '323410', name: '카카오뱅크', market: 'KOSPI', sector: '금융', yahoo: '323410.KS' },
  { code: '004020', name: '현대제철', market: 'KOSPI', sector: '철강', yahoo: '004020.KS' },
  { code: '138040', name: '메리츠금융지주', market: 'KOSPI', sector: '금융', yahoo: '138040.KS' },
  { code: '011170', name: '롯데케미칼', market: 'KOSPI', sector: '화학', yahoo: '011170.KS' },
  { code: '011070', name: 'LG이노텍', market: 'KOSPI', sector: '전자부품', yahoo: '011070.KS' },
  { code: '008770', name: '호텔신라', market: 'KOSPI', sector: '유통·호텔', yahoo: '008770.KS' },
  { code: '021240', name: '코웨이', market: 'KOSPI', sector: '가전·렌탈', yahoo: '021240.KS' },
  { code: '032640', name: 'LG유플러스', market: 'KOSPI', sector: '통신', yahoo: '032640.KS' },
  { code: '000720', name: '현대건설', market: 'KOSPI', sector: '건설', yahoo: '000720.KS' },
  { code: '028050', name: '삼성E&A', market: 'KOSPI', sector: '엔지니어링', yahoo: '028050.KS' },
  { code: '069620', name: '대웅제약', market: 'KOSPI', sector: '제약', yahoo: '069620.KS' },
  { code: '000100', name: '유한양행', market: 'KOSPI', sector: '제약', yahoo: '000100.KS' },
  { code: '128940', name: '한미약품', market: 'KOSPI', sector: '제약', yahoo: '128940.KS' },
  { code: '004990', name: '롯데지주', market: 'KOSPI', sector: '지주회사', yahoo: '004990.KS' },
  { code: '023530', name: '롯데쇼핑', market: 'KOSPI', sector: '유통', yahoo: '023530.KS' },
  { code: '004170', name: '신세계', market: 'KOSPI', sector: '유통', yahoo: '004170.KS' },
  { code: '139480', name: '이마트', market: 'KOSPI', sector: '유통', yahoo: '139480.KS' },
  { code: '097950', name: 'CJ제일제당', market: 'KOSPI', sector: '식품', yahoo: '097950.KS' },
  { code: '271560', name: '오리온', market: 'KOSPI', sector: '식품', yahoo: '271560.KS' },
  { code: '145720', name: '덴티움', market: 'KOSPI', sector: '의료기기', yahoo: '145720.KS' },
  { code: '267250', name: 'HD현대', market: 'KOSPI', sector: '지주회사', yahoo: '267250.KS' },
  { code: '000880', name: '한화', market: 'KOSPI', sector: '지주회사', yahoo: '000880.KS' },
  { code: '096530', name: '씨젠', market: 'KOSDAQ', sector: '진단시약', yahoo: '096530.KQ' },
  { code: '018880', name: '한온시스템', market: 'KOSPI', sector: '자동차부품', yahoo: '018880.KS' },
  { code: '010140', name: '삼성중공업', market: 'KOSPI', sector: '조선', yahoo: '010140.KS' },
  { code: '079550', name: 'LIG넥스원', market: 'KOSPI', sector: '방산', yahoo: '079550.KS' },
  { code: '196170', name: '알테오젠', market: 'KOSDAQ', sector: '바이오', yahoo: '196170.KQ' },
  { code: '086520', name: '에코프로', market: 'KOSDAQ', sector: '2차전지소재', yahoo: '086520.KQ' },
  { code: '247540', name: '에코프로비엠', market: 'KOSDAQ', sector: '2차전지소재', yahoo: '247540.KQ' },
  { code: '091990', name: '셀트리온헬스케어', market: 'KOSDAQ', sector: '바이오', yahoo: '091990.KQ' },
  { code: '293490', name: '카카오게임즈', market: 'KOSDAQ', sector: '게임', yahoo: '293490.KQ' },
  { code: '112040', name: '위메이드', market: 'KOSDAQ', sector: '게임', yahoo: '112040.KQ' },
  { code: '263750', name: '펄어비스', market: 'KOSDAQ', sector: '게임', yahoo: '263750.KQ' },
  { code: '041510', name: 'SM', market: 'KOSDAQ', sector: '엔터', yahoo: '041510.KQ' },
  { code: '035900', name: 'JYP Ent.', market: 'KOSDAQ', sector: '엔터', yahoo: '035900.KQ' },
  { code: '122870', name: '와이지엔터테인먼트', market: 'KOSDAQ', sector: '엔터', yahoo: '122870.KQ' },
  { code: '352820', name: '하이브', market: 'KOSPI', sector: '엔터', yahoo: '352820.KS' },
  { code: '357780', name: '솔브레인', market: 'KOSDAQ', sector: '반도체소재', yahoo: '357780.KQ' },
  { code: '039030', name: '이오테크닉스', market: 'KOSDAQ', sector: '반도체장비', yahoo: '039030.KQ' },
  { code: '058470', name: '리노공업', market: 'KOSDAQ', sector: '반도체부품', yahoo: '058470.KQ' },
  { code: '240810', name: '원익IPS', market: 'KOSDAQ', sector: '반도체장비', yahoo: '240810.KQ' },
  { code: '278280', name: '천보', market: 'KOSDAQ', sector: '2차전지소재', yahoo: '278280.KQ' },
  { code: '066970', name: '엘앤에프', market: 'KOSDAQ', sector: '2차전지소재', yahoo: '066970.KQ' },
  { code: '328130', name: '루닛', market: 'KOSDAQ', sector: 'AI의료', yahoo: '328130.KQ' },
  { code: '277810', name: '레인보우로보틱스', market: 'KOSDAQ', sector: '로봇', yahoo: '277810.KQ' },
  { code: '108860', name: '셀바스AI', market: 'KOSDAQ', sector: 'AI', yahoo: '108860.KQ' },
  { code: '005830', name: 'DB손해보험', market: 'KOSPI', sector: '보험', yahoo: '005830.KS' },
  { code: '000210', name: 'DL', market: 'KOSPI', sector: '건설·화학', yahoo: '000210.KS' },
  { code: '375500', name: 'DL이앤씨', market: 'KOSPI', sector: '건설', yahoo: '375500.KS' },
  { code: '006360', name: 'GS건설', market: 'KOSPI', sector: '건설', yahoo: '006360.KS' },
  { code: '294870', name: 'HDC현대산업개발', market: 'KOSPI', sector: '건설', yahoo: '294870.KS' },
  { code: '001040', name: 'CJ', market: 'KOSPI', sector: '지주회사', yahoo: '001040.KS' },
  { code: '079160', name: 'CJ CGV', market: 'KOSPI', sector: '엔터·영화', yahoo: '079160.KS' },
  { code: '035250', name: '강원랜드', market: 'KOSPI', sector: '레저', yahoo: '035250.KS' },
  { code: '008560', name: '메리츠증권', market: 'KOSPI', sector: '증권', yahoo: '008560.KS' },
  { code: '006800', name: '미래에셋증권', market: 'KOSPI', sector: '증권', yahoo: '006800.KS' },
  { code: '005940', name: 'NH투자증권', market: 'KOSPI', sector: '증권', yahoo: '005940.KS' },
  { code: '030210', name: '한국투자금융지주', market: 'KOSPI', sector: '증권', yahoo: '030210.KS' },
  { code: '016360', name: '삼성증권', market: 'KOSPI', sector: '증권', yahoo: '016360.KS' },
  { code: '071050', name: '한국금융지주', market: 'KOSPI', sector: '증권', yahoo: '071050.KS' },
  { code: '336260', name: '두산밥캣', market: 'KOSPI', sector: '기계', yahoo: '336260.KS' },
  { code: '000150', name: '두산', market: 'KOSPI', sector: '지주회사', yahoo: '000150.KS' },
  { code: '241560', name: '두산밥캣', market: 'KOSPI', sector: '기계', yahoo: '241560.KS' },
  { code: '285130', name: 'SK케미칼', market: 'KOSPI', sector: '화학·바이오', yahoo: '285130.KS' },
  { code: '011790', name: 'SKC', market: 'KOSPI', sector: '소재', yahoo: '011790.KS' },
  { code: '298050', name: '효성첨단소재', market: 'KOSPI', sector: '소재', yahoo: '298050.KS' },
  { code: '004800', name: '효성', market: 'KOSPI', sector: '지주회사', yahoo: '004800.KS' },
  { code: '298040', name: '효성중공업', market: 'KOSPI', sector: '중공업', yahoo: '298040.KS' },
  { code: '001450', name: '현대해상', market: 'KOSPI', sector: '보험', yahoo: '001450.KS' },
  { code: '000670', name: '영풍', market: 'KOSPI', sector: '비철금속', yahoo: '000670.KS' },
  { code: '018670', name: 'SK가스', market: 'KOSPI', sector: '가스', yahoo: '018670.KS' },
  { code: '036460', name: '한국가스공사', market: 'KOSPI', sector: '가스', yahoo: '036460.KS' },
];

// Convenience: build search index
export function searchStocks(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = KR_STOCKS.map(s => {
    const nameLower = s.name.toLowerCase();
    let score = 0;
    if (s.code === q) score = 100;
    else if (s.code.startsWith(q)) score = 90;
    else if (nameLower === q) score = 85;
    else if (nameLower.startsWith(q)) score = 80;
    else if (nameLower.includes(q)) score = 60;
    else if (s.sector && s.sector.toLowerCase().includes(q)) score = 30;
    return { ...s, score };
  }).filter(s => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ score, ...rest }) => rest);
}

export function findByCode(code) {
  return KR_STOCKS.find(s => s.code === code || s.yahoo === code);
}

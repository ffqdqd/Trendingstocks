# 주식 트렌드 알림 (Stock Trend Alert)

내가 지정한 종목의 매수·매도 타이밍을 AI 분석 기준으로 지속 감시하고, 조건 만족 시 즉시 알려주는 서비스.

## 진행 현황 (2026-09-29)

| 단계 | 산출물 | 상태 |
|:---:|---|:---:|
| 1 | [요건정리](docs/01_요건정리_v0.1.0.md) | ✅ v0.1.0 |
| 2 | [에이전트·스킬 구성](docs/02_에이전트_스킬_구성_v0.1.0.md) | ✅ v0.1.0 |
| 3 | [기능정의](docs/03_기능정의_v0.1.0.md) | ✅ v0.1.0 |
| 4 | [화면기획 (Storyboard)](docs/04_화면기획_v0.1.0.md) | ✅ v0.1.0 |
| 5 | [화면 목업 (HTML)](prototype/index.html) | ✅ v0.1.0 |
| 6 | React 앱 구현 | ⏳ 다음 단계 |
| 7 | KIS OpenAPI 연동 | ⏳ 2차 |
| 8 | 감시 배치 & 알림 발송 | ⏳ 2차 |

## 프로토타입 열기

```bash
# 브라우저로 바로 열기
start prototype/index.html         # Windows
# 또는 로컬 서버
python -m http.server 8080         # http://localhost:8080/prototype/
```

프로토타입은 6화면(대시보드·검색·종목상세·즐겨찾기·알림이력·설정) 이 사이드바 네비게이션으로 전환된다. Chart.js 로 60일 캔들 + 지지·저항선 오버레이가 시연되고, 알림 설정 슬라이드 패널·즐겨찾기 토글·검색 자동완성이 동작한다.

## 핵심 기능

- **F1** 종목 검색 & AI 분석 리포트 (5카드: 헤더·가격다이어그램·코멘트·대응가이드·차트)
- **F2** 즐겨찾기 (localStorage → 서버 DB 2차)
- **F3** 알림 조건 설정 (매수·매도·손절·목표가 4종, 임계 가격 커스텀)
- **F4** 매수/매도 알림 (브라우저 Notification, 5분 배치, 24h 쿨다운)
- **F5** 알림 이력 리스트

## 활용한 헤이데어 자산

- 에이전트 6종: `designer`, `storyboard_writer`, `feature_critic`, `qa_tester`, `qa_senior`, `qc_reviewer`
- 스킬 5종: `heydear_design_system`, `common_uiux_guide`, `storyboard_writer`, `data_model_spec`, `code_quality_rules`

상세는 [docs/02_에이전트_스킬_구성_v0.1.0.md](docs/02_에이전트_스킬_구성_v0.1.0.md) 참조.

## 리스크 & 면책

본 서비스는 규칙 기반 기술적 분석 참고용이며, 어떠한 수익도 보장하지 않는다. 투자 판단과 그 결과는 사용자 본인의 책임.

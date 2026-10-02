# Lab 03. Express REST API & Middleware

Ubuntu 22.04 환경에서 Express.js 서버를 구성하고, Postman을 사용해 **Routing · Middleware · HTTP Method · Request Data · Response** 흐름을 검증한 실습.

기본 API 구현에 기존 Linux NAT Router 구조와 VS Code Remote SSH를 연결하여 **Windows Client → NAT Router → Express Server** 전체 접근 경로까지 확인.

---

## Overview

### Provided Mission

- Ubuntu 22.04 Express Server 구성
- Express Generator + EJS 기반 기본 프로젝트 생성
- GET / POST Routing
- Query Parameter 처리
- Path Parameter 처리
- JSON Request Body 처리
- Update / Delete API 응답 구현
- Postman 기반 API 검증
- DB 미연동 상태에서 Request / Response 흐름 확인

### Extended / My Work

- Express Server를 기존 VMnet2 내부망에 배치
- NAT Router의 3000 Port → Express Server DNAT 구성
- Windows Postman에서 내부 Express API 접근 검증
- NAT Router를 Jump Host로 사용한 VS Code Remote SSH 개발 환경 구성
- Express `app.js`의 Middleware 실행 순서와 Router 연결 구조 분석

---

## Architecture

```text
Windows 11
Postman / VS Code
      │
      │ HTTP :3000 / SSH
      ▼
NAT Router
WAN 192.168.5.128
LAN 10.10.0.1
      │
      │ DNAT / VMnet2
      ▼
Express Server
10.10.0.20:3000
      │
      ├─ app.js
      │   ├─ Middleware
      │   └─ /test → testRouter
      │
      └─ routes/test.js
```

| Component | Role | Address |
|---|---|---|
| Windows 11 | Postman / VS Code Client | VMnet8 Host |
| NAT Router | Gateway / DNAT / SSH Jump Host | `192.168.5.128` / `10.10.0.1` |
| Express Server | REST API Server | `10.10.0.20:3000` |

---

## Key Implementation

### Express Runtime

Node.js Runtime과 npm 기반 Express Project 구성.

```bash
express --view=ejs express-middleware-lab
cd express-middleware-lab
npm install
npm start
```

```text
Node.js
→ JavaScript Runtime

npm
→ Package / Dependency Management

Express
→ Node.js Web Server / API Framework
```

---

### Middleware & Router Flow

`app.js`에서 공통 Middleware를 등록한 뒤 URL Prefix에 따라 Router 연결.

```javascript
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/test', testRouter);
```

`app.use(express.json())`은 경로 제한 없이 요청 흐름에 등록되며, JSON Body가 존재할 경우 Parsing 후 `req.body`로 제공.

```text
Request
→ Middleware
→ Router
→ Handler
→ Response
```

---

### Request Data Handling

| Input Location | Express | Example |
|---|---|---|
| Query String | `req.query` | `/plus?num1=10&num2=20` |
| URL Path | `req.params` | `/minus/10/20` |
| Request Body | `req.body` | JSON `{"name":"홍길동"}` |

Request의 값 전달 위치와 Response 형식은 별도 개념으로 처리.

```text
Request Input
query / params / body
        ↓
Application Logic
        ↓
Response
Text / JSON / HTML
```

---

### API Endpoints

| Method | Endpoint | Input | Response |
|---|---|---|---|
| GET | `/test` | - | Text |
| POST | `/test` | - | JSON |
| GET | `/test/plus` | Query Parameter | Text |
| GET | `/test/minus/:num1/:num2` | Path Parameter | Text |
| POST | `/test/profile` | JSON Body | JSON |
| PUT | `/test/update/:id` | Path + JSON Body | JSON |
| DELETE | `/test/delete/:id` | Path Parameter | JSON |

Example:

```text
GET /test/plus?num1=10&num2=20
→ req.query
→ Number conversion
→ 30
```

```text
PUT /test/update/1
+ {"name":"김철수"}

→ req.params.id
→ req.body.name
→ {"message":"1번 회원 이름 변경(김철수)"}
```

---

### DNAT / API Access

Windows Host는 VMnet2 내부망의 `10.10.0.20`에 직접 접근하지 않고 NAT Router를 통해 Express API에 접근.

```bash
sudo iptables -t nat -A PREROUTING \
  -i ens37 \
  -p tcp \
  --dport 3000 \
  -j DNAT \
  --to-destination 10.10.0.20:3000
```

```text
Windows Postman
→ Router WAN :3000
→ DNAT
→ Express 10.10.0.20:3000
```

---

### Remote Development

VMware Console의 Terminal 편집 대신 NAT Router를 Jump Host로 사용하여 Windows VS Code에서 Express Server 직접 편집.

```text
Windows VS Code
→ SSH Jump Host
  192.168.5.128
→ Express Server
  10.10.0.20
```

Remote VS Code 화면에서 수정한 파일은 Windows 복사본이 아니라 Linux Server의 실제 Project File에 저장.

---

## Verification

| Check | Result |
|---|---|
| Express Runtime / TCP 3000 Listen | PASS |
| Windows → NAT Router → Express DNAT | PASS |
| GET `/test` Text Response | PASS |
| POST `/test` JSON Response | PASS |
| Query Parameter / `req.query` | PASS |
| Path Parameter / `req.params` | PASS |
| JSON Body / `req.body` | PASS |
| PUT Params + Body | PASS |
| DELETE Path Parameter | PASS |
| Postman HTTP 200 Response | PASS |

---

## Troubleshooting

### VMware Console 편집 불편

VMware Console의 `nano`에서 Windows Clipboard와 한글 입력이 불편하여 Remote SSH 방식으로 전환.

```text
VMware Console 직접 편집
→ VS Code Remote SSH
```

NAT Router를 SSH Jump Host로 사용해 내부망 Express Server Project를 Windows VS Code에서 직접 수정.

---

## What I Learned

- `app.js` = Express Application의 Middleware 순서와 Router 연결을 정의하는 중심 설정
- Middleware = Request와 최종 Handler 사이의 공통 처리 단계
- Router = URL Path와 HTTP Method에 따른 Handler 분리
- 동일 URL도 GET / POST 등 HTTP Method에 따라 다른 API로 처리 가능
- `req.query`, `req.params`, `req.body`의 역할 차이
- `res.send()`, `res.json()`, `res.render()`의 Response 형식 차이
- Node.js Runtime · npm Dependency · Express Application의 관계
- API 구현과 실제 Network 접근 경로를 함께 검증하는 방식 이해

---

## Detailed Lab Notes

명령어, Express Generator 구조, `app.js` Middleware 흐름, Postman 사용법, Query / Params / Body 차이와 각 API 구현 과정은 Notion에 상세 기록.

[View detailed Infrastructure Lab notes](https://app.notion.com/p/3ed1b198732a8195bf58df22d368f5c9?pvs=204)

# 사용자 관리 화면

React·Axios로 사용자 목록 조회·추가·수정·삭제를 처리하는 프론트엔드 실습. Vite Proxy로 /users 요청을 Spring Boot API에 전달합니다.

- 화면: 사용자 목록, 등록·수정
- API: GET·POST /users, GET·PUT·DELETE /users/{id}
- 연결: React → Vite Proxy → Spring Boot → MySQL

## 실행

Backend와 DB를 준비한 뒤 이 폴더에서 실행합니다.

```bash
npm install
npm run dev
```

기본 접속 주소: http://localhost:5173. API Proxy 대상은 vite.config.js에서 확인할 수 있습니다.

[전체 구성·실행·검증](../README.md)

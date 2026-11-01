# Full-Stack Integration Lab

[English](./README.en.md)

React·API·DB·Linux 서버를 연결한 실습 모음. DB·Proxy 설정을 환경에 맞추고 서버를 분리한 뒤 API 응답·브라우저 화면·DB 데이터를 대조했습니다.

## Linux 3-Tier와 NAT Router

**React·Spring Boot·MySQL을 각각 Ubuntu VM에 배치하고 Linux NAT Router로 연결한 실습.**

- 고정 IP·Gateway, IP Forwarding 구성
- MASQUERADE를 통한 외부 통신, DNAT를 통한 내부 서버 접근
- SSH/SCP 원격 접속·파일 전송
- Spring 호스트 전용 앱 계정으로 MySQL 연결
- Gateway·DNS, Vite Proxy, DB 접속 설정을 나누어 오류 점검

[구성·애플리케이션 검증](./02-linux-3tier/README.md) · [명령어·네트워크 문제 해결](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175)

## 실습 목록

| Lab | 작업·검증 |
| --- | --- |
| [01 · React + Spring Boot + MySQL](./01-react-spring-db-windows/README.md) | 강사 제공 예제를 로컬 MySQL에 연결, CRUD 검증·Edit 요청 경로 수정 |
| [02 · Linux 3-Tier](./02-linux-3tier/README.md) | 서버 분리, NAT·DNAT·SSH/SCP, 브라우저→DB 연결 검증 |
| [03 · Express API](./03-express-rest-api-middleware/README.md) | Query·Path·Body 처리, Middleware 순서, Postman 요청·응답 확인 |

Lab 01의 React/Spring 소스를 Lab 02에서 재사용했습니다. Lab 02에는 배포 기록·캡처를, Lab 03에는 Express 소스를 보관합니다.

## 기술 기록

GitHub에는 애플리케이션 설정·소스·API·DB 캡처를, Notion에는 VM·네트워크 설정·명령어·문제 해결 과정을 기록했습니다.

| GitHub | Notion |
| --- | --- |
| [Linux 3-Tier](./02-linux-3tier/) | [Lab 03 · Linux 3-Tier + NAT Router](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175) |
| [Express API](./03-express-rest-api-middleware/) | [Lab 04 · Express API & Middleware](https://app.notion.com/p/3ed1b198732a8195bf58df22d368f5c9) |

[Infrastructure Lab 목록](https://app.notion.com/p/3dd1b198732a8059b1b1f2f410f08dc6)

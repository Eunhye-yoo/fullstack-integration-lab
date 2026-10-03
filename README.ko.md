# Full-Stack Integration Lab

**Frontend, Backend, Database, Linux Server, Network Path, REST API Request Flow**를 하나의 흐름으로 연결하며 학습한 통합 실습 저장소입니다.

로컬 환경의 애플리케이션 연동부터 시작해, 동일한 흐름을 분리된 Linux 서버와 라우팅 환경으로 확장하고, 이후 Middleware/API 실습까지 단계적으로 연결합니다.

> 상세한 인프라 구축 과정, 실제 명령어, 검증 Screenshot, Troubleshooting 기록은 [Notion Infrastructure Lab](https://app.notion.com/p/Infrastructure-Lab-3dd1b198732a8059b1b1f2f410f08dc6?source=copy_link)에 정리합니다.

## Labs

| Lab | 주요 내용 | 핵심 검증 |
| --- | --- | --- |
| [01 · React + Spring Boot + MySQL](./01-react-spring-db-windows) | React · Vite Proxy · Spring Boot · MyBatis · MySQL 8 | Browser ↔ API ↔ DB CRUD |
| [02 · Linux 3-Tier + NAT Router](./02-linux-3tier) | Ubuntu VM · Static IP · Linux Routing/NAT · SSH/SCP · DNAT | Windows → Router → React → Spring Boot → MySQL |
| [03 · Express REST API & Middleware](./03-express-rest-api-middleware) | Node.js · Express · Routing · Middleware · Postman · REST API | Query / Params / Body → HTTP Response |

## GitHub ↔ Notion Navigation

GitHub와 Notion은 서로 다른 번호 체계를 사용하며, 아래 항목은 동일한 Mission을 **Application 관점과 Infrastructure 관점**에서 각각 기록합니다.

| Application / GitHub | Environment / Notion |
| --- | --- |
| [GitHub 02 · Linux 3-Tier](./02-linux-3tier/) | [Notion 03 · Linux 3-Tier + NAT Router](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175) |
| [GitHub 03 · Express REST API](./03-express-rest-api-middleware/) | [Notion 04 · Express REST API & Middleware](https://app.notion.com/p/3ed1b198732a8195bf58df22d368f5c9) |

GitHub 01에는 Linux Lab에서 재사용한 React/Spring Source가 포함되어 있습니다. GitHub 02는 배포 및 연결 검증 Evidence, GitHub 03은 Express Source를 포함합니다. VyOS/FastAPI/MariaDB Notion Lab은 현재 계획 단계이며, 아직 대응되는 완료 Application Lab은 없습니다.

## Progression

```text
Lab 01
Windows localhost environment
React → Spring Boot → MySQL
        ↓
Lab 02
Separated Ubuntu servers
Windows → NAT Router → React → Spring Boot → MySQL
        ↓
Lab 03
Express API / Middleware
Postman → NAT Router → Express
        ↓
Query / Params / Body → Response
```

## Focus Areas

- Frontend, Backend, Database Layer 간 Application Integration
- 분리된 서버 간 IP 기반 통신
- Static IP, Default Gateway, Routing, IPv4 Forwarding, NAT
- SSH/SCP 및 VS Code Remote SSH
- 외부에서 내부 서버로 연결하기 위한 DNAT / Port Forwarding
- REST API Routing 및 HTTP Method 처리
- Query Parameter, Path Parameter, Request Body 처리
- Middleware 실행 흐름과 Response Format
- Layer별 Verification 및 Troubleshooting

## Tech

`React` `Vite` `Java 17` `Spring Boot` `MyBatis` `MySQL` `Node.js` `Express.js` `EJS` `Postman` `Linux` `VMware` `iptables` `SSH/SCP`

## Documentation

- [Lab 01 README](./01-react-spring-db-windows/README.md)
- [Lab 02 README](./02-linux-3tier/README.md)
- [Lab 03 README](./03-express-rest-api-middleware/README.md)
- [Notion Infrastructure Lab](https://app.notion.com/p/Infrastructure-Lab-3dd1b198732a8059b1b1f2f410f08dc6?source=copy_link)

이 저장소는 이후 추가 Integration / Infrastructure Lab과 함께 계속 확장합니다.

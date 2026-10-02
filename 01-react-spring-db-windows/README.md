# Lab 01. React + Spring Boot + MySQL Integration

강사 제공 React / Spring Boot 예제를 로컬 MySQL 8.0 환경에 맞게 재구성한 통합 실습.  
React → Vite Proxy → Spring Boot → MyBatis → MySQL 연결 및 CRUD 동작 검증.

## Overview

| 구분 | 내용 |
|---|---|
| Provided | React + Vite frontend, Spring Boot + MyBatis backend, MariaDB 기준 datasource 설정, `testDB.sql` |
| My work | MySQL 8.0 적용, datasource 변경, credential 환경변수 분리, React–Spring Boot 연동, CRUD 검증, Edit API 경로 수정 |

강사 제공 코드는 baseline commit으로 분리.  
로컬 환경 설정과 연동 변경은 후속 commit으로 관리.

## Architecture

```text
Browser
  ↓
React + Vite (:5173)
  ↓  /users
Vite Proxy
  ↓
Spring Boot REST API (:8081)
  ↓
Service
  ↓
MyBatis Mapper
  ↓
MySQL 8.0
```

## Key Implementation

### Backend Configuration

#### Database

강사 제공 `testDB.sql`을 MySQL 8.0에 적용.

```text
testDB
└── user
    ├── id    BIGINT, PK, AUTO_INCREMENT
    ├── name  VARCHAR(50)
    └── email VARCHAR(100)
```

Schema 및 데이터 조회 확인.

```sql
SHOW TABLES;
DESC user;
SELECT * FROM user;
```

#### JDBC / Datasource

MariaDB 기준 설정을 로컬 MySQL 8.0 환경으로 변경.

- `mariadb-java-client` → `mysql-connector-j`
- JDBC Driver → `com.mysql.cj.jdbc.Driver`
- DB credential → IntelliJ Run Configuration 환경변수로 분리

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Frontend Integration

Vite 개발 서버에서 `/users` 요청을 Spring Boot `:8081`로 전달하도록 Proxy 구성.

```javascript
server: {
  proxy: {
    '/users': {
      target: 'http://localhost:8081',
      changeOrigin: true
    }
  }
}
```

React Router 화면 경로와 Backend API 경로 분리.

```text
React Router
/            → UserList
/edit/:id    → EditUser

REST API
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
DELETE /users/{id}
```

### Request Flow

```text
React
  ↓ axios
Vite Proxy
  ↓
UserController
  ↓
UserService
  ↓
UserMapper
  ↓
UserMapper.xml
  ↓
MySQL
  ↓
Response (GET: JSON / POST·PUT·DELETE: Text)
  ↓
React state update
```

## Verification

| Method | Endpoint | 확인 내용 |
|---|---|---|
| GET | `/users` | 사용자 목록 조회 |
| GET | `/users/{id}` | 단일 사용자 조회 |
| POST | `/users` | 사용자 추가 및 DB row 생성 |
| PUT | `/users/{id}` | 사용자 정보 수정 및 DB 반영 |
| DELETE | `/users/{id}` | 사용자 삭제 및 DB 반영 |

브라우저 화면과 MySQL Workbench 결과 비교를 통한 CRUD 반영 확인.

![CRUD verification](./docs/images/crud-verification.PNG)

Chrome DevTools Network 탭에서 API 요청 및 `200 OK` 응답 확인.

![Network verification](./docs/images/network-verification.PNG)

## Troubleshooting

### Edit 요청만 실패

**Issue**  
목록 조회·추가·삭제는 정상 동작했으나 Edit 진입 시 사용자 조회 실패.

**Cause**  
Edit 요청에 특정 서버의 absolute URL이 하드코딩되어 있어 로컬 Vite Proxy 우회.

```javascript
axios.get(`http://54.180.94.5:8081/users/${id}`)
```

**Fix**  
다른 CRUD 요청과 동일하게 relative path 사용.

```javascript
axios.get(`/users/${id}`)
```

**Result**  
Vite Proxy를 통한 `GET /users/{id}` 요청 정상화 및 Edit 화면 진입 확인.

## Environment

- Windows 10
- Java 17
- Spring Boot 3.5.4
- MyBatis
- MySQL 8.0
- React 19
- Vite 7
- Node.js 24
- npm 11


## Project Structure

- [frontend/](./frontend/) — React 화면·Axios 요청·Vite proxy
- [backend/](./backend/) — Controller·Service·MyBatis Mapper 및 Maven 실행 설정
- [docs/images/](./docs/images/) — 브라우저·DB·Network 검증 캡처

## Runtime / Reproduction

Backend에는 JDK 17, Frontend에는 현재 Vite dependency의 Node.js 요구사항에 맞는 Runtime 필요. 아래는 현재 소스 기준 실행 절차이며 재설치 검증 완료를 뜻하지 않음.

1. MySQL에 `testDB.user` 준비. 강사 제공 원본 `testDB.sql`은 [Notion 03 · Database Import](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175)의 `testDB.zip`에서 내려받아 압축 해제. 새 환경에서의 초기 DB Import는 미검증.
2. Backend 실행 환경에 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 설정. 예: `DB_URL=jdbc:mysql://localhost:3306/testDB`.
3. 저장소 루트 기준 각 Terminal에서 실행:

~~~powershell
# Backend (DB 환경변수 설정 후)
cd 01-react-spring-db-windows/backend
.\mvnw.cmd spring-boot:run
~~~

~~~powershell
# Frontend (별도 Terminal)
cd 01-react-spring-db-windows/frontend
npm install
npm run dev
~~~

브라우저: `http://localhost:5173`. Backend: `:8081`. `pom.xml`은 Java 17 / Spring Boot 3.5.4 / MyBatis starter 3.0.3, frontend lockfile은 React 19.1.1 / Vite 7.1.2 기준.

## What I Learned

- 화면 경로와 API 경로를 분리하고 동일 출처의 relative URL로 Vite proxy 활용
- datasource driver·주소·credential을 실행 환경에 맞게 구성
- 화면 성공 여부와 API 응답·DB 반영 결과를 함께 확인

## Related Labs

같은 앱을 Linux VM으로 분리한 확장 실습: [GitHub 02 · Linux 3-Tier](../02-linux-3tier/) · [Notion 03 · Linux 3-Tier + NAT Router](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175).

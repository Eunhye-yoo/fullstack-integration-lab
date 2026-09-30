# Lab 01. React + Spring Boot + MySQL Integration

강사 제공 React / Spring Boot 예제를 로컬 MySQL 8.0 환경에 맞게 재구성한 통합 실습.  
React → Vite Proxy → Spring Boot → MyBatis → MySQL 연결 및 CRUD 동작 검증.

## Scope

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

## Backend Configuration

### Database

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

### JDBC / Datasource

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

## Frontend Integration

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

## Request Flow

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
JSON Response
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

# Lab 01. React + Spring Boot + Database Integration

## 1. Goal

React 프론트엔드, Spring Boot 백엔드, 데이터베이스를 직접 연결하여
사용자의 요청이 데이터베이스까지 전달되고 다시 화면으로 반환되는 전체 흐름을 이해한다.

## 2. Starting Point

강사가 제공한 예제 코드를 기반으로 실습한다.

- Frontend: React
- Backend: Spring Boot
- Original DB configuration: MariaDB

### Provided Source

- React: https://github.com/Joes-s/react_boot_front
- Spring Boot: https://github.com/Joes-s/react_boot_back
- Database: `testDB.sql`

> 강사 제공 코드는 별도 baseline commit으로 먼저 기록하고, 이후 로컬 환경에 맞춘 연동 변경을 별도 commit으로 분리했다.

## 3. Target Architecture

```text
React
  ↓ HTTP
Spring Boot REST API
  ↓ MyBatis / JDBC
MySQL 8.0
```

## 4. Environment

- Windows 10
- Java 17
- Spring Boot 3.5.4
- MyBatis
- MySQL 8.0
- Node.js 24
- npm 11
- Git 2.55

## 5. Implementation

### 5.1 Database Setup

강사가 제공한 `testDB.sql`을 로컬 MySQL 8.0에서 실행하여 다음 구조를 생성했다.

```text
testDB
└── user
    ├── id    BIGINT, PK, AUTO_INCREMENT
    ├── name  VARCHAR(50)
    └── email VARCHAR(100)
```

### 5.2 Spring Boot → MySQL Configuration

강사 제공 백엔드는 MariaDB 기준이었지만, 로컬 Windows 환경에서는 이미 실행 중인 MySQL 8.0을 사용하도록 변경했다.

- MariaDB JDBC driver → MySQL Connector/J
- JDBC driver class → `com.mysql.cj.jdbc.Driver`
- DB 접속정보는 소스에 직접 기록하지 않고 환경변수로 분리
  - `DB_URL`
  - `DB_USERNAME`
  - `DB_PASSWORD`

실제 변경 내용은 아래 파일에서 확인할 수 있다.

- [backend/pom.xml](./backend/pom.xml)
- [backend/src/main/resources/application.properties](./backend/src/main/resources/application.properties)

## 6. Request Flow

```text
GET /users
   ↓
UserController.listUsers()
   ↓
UserService.getAllUsers()
   ↓
UserMapper.findAll()
   ↓
UserMapper.xml
   ↓
SELECT * FROM user
   ↓
MySQL testDB
   ↓
JSON response
```

관련 코드:

- [UserController.java](./backend/src/main/java/com/co/mybatis/controller/UserController.java)
- [UserService.java](./backend/src/main/java/com/co/mybatis/service/UserService.java)
- [UserMapper.java](./backend/src/main/java/com/co/mybatis/mapper/UserMapper.java)
- [UserMapper.xml](./backend/src/main/resources/mapper/UserMapper.xml)

## 7. Verification

### Database Verification

MySQL에서 다음을 직접 확인했다.

```sql
SHOW TABLES;
DESC user;
SELECT * FROM user;
```

### Backend Integration Verification

Spring Boot 실행 후 다음 endpoint를 호출했다.

```http
GET http://localhost:8081/users
```

2026-09-30 로컬 환경에서 `/users` 요청이 정상 응답하는 것을 확인했다.

> README 문장만으로 실행 성공을 증명하는 것은 아니다. 이 저장소에서는 **강사 제공 baseline commit과 이후 MySQL 연동 commit을 분리**하고, 실제 JDBC 의존성·datasource 설정·MyBatis 조회 코드를 함께 남겨 변경 근거를 확인할 수 있게 했다. 실행 결과 캡처나 테스트 로그는 추가 증거가 필요할 때 별도로 보강한다.

## 8. Troubleshooting

### MySQL authentication failure

**Problem**

```text
Access denied for user 'root'@'localhost' (using password: YES)
```

**Cause**

IntelliJ Run Configuration의 `DB_PASSWORD` 값이 실제 MySQL 비밀번호와 다르게 입력되어 있었다.

**Resolution**

`DB_PASSWORD` 값을 수정한 뒤 Spring Boot 애플리케이션을 재시작했다.

**Result**

Spring Boot에서 MySQL 연결에 성공했고 `GET /users` 요청을 통해 `testDB.user` 조회를 확인했다.

## 9. What I Learned

- IntelliJ의 Database 도구 연결과 Spring Boot의 datasource 연결은 서로 독립적이다.
- JDBC Driver는 Java 애플리케이션과 DBMS 사이의 연결을 담당한다.
- 환경변수를 사용하면 DB 비밀번호를 소스 코드와 GitHub에 직접 노출하지 않을 수 있다.
- 연결 문제는 DB 서버 → 인증 → Spring datasource → MyBatis → API 순서로 계층별 확인하면 원인을 좁히기 쉽다.

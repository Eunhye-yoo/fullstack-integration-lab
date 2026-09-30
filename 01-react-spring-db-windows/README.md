# Lab 01. React + Spring Boot + MySQL Integration

강사가 제공한 React / Spring Boot 예제를 로컬 환경에 맞게 구성하고,
Spring Boot와 MySQL 간 데이터 조회가 정상적으로 동작하는지 검증한 실습입니다.

> **Current status:** Spring Boot ↔ MySQL 연동 완료 / React 연동 진행 예정

## Scope

| 구분 | 내용 |
|---|---|
| Provided | React + Vite frontend, Spring Boot + MyBatis backend, MariaDB 기준 datasource 설정, `testDB.sql` |
| My work | 로컬 MySQL 8.0 구성, DB schema 적용, datasource 변경, credential 환경변수 분리, `/users` 조회 검증 |

강사 제공 코드는 baseline commit으로 남기고, 이후 로컬 환경에 맞게 변경한 작업은 별도 commit으로 분리했습니다.

## Architecture

```text
React
  ↓ HTTP
Spring Boot REST API
  ↓ MyBatis / JDBC
MySQL 8.0
```

현재는 아래 구간까지 검증을 완료했습니다.

```text
GET /users
   ↓
UserController
   ↓
UserService
   ↓
UserMapper
   ↓
UserMapper.xml
   ↓
MySQL testDB.user
   ↓
JSON response
```

## Local DB Setup

강사가 제공한 `testDB.sql`을 로컬 MySQL 8.0에 적용했습니다.

```text
testDB
└── user
    ├── id    BIGINT, PK, AUTO_INCREMENT
    ├── name  VARCHAR(50)
    └── email VARCHAR(100)
```

테이블 생성 후 아래 쿼리로 schema와 조회 결과를 확인했습니다.

```sql
SHOW TABLES;
DESC user;
SELECT * FROM user;
```

## Backend Configuration

기존 백엔드는 MariaDB 기준으로 설정되어 있었지만, 로컬 PC에서 이미 사용 중인 MySQL 8.0에 맞춰 datasource 구성을 변경했습니다.

### JDBC Driver

`pom.xml`의 MariaDB driver를 MySQL Connector/J로 교체했습니다.

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### Datasource

DB 접속정보는 repository에 직접 저장하지 않고 IntelliJ Run Configuration의 환경변수로 분리했습니다.

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Relevant files:

- [pom.xml](./backend/pom.xml)
- [application.properties](./backend/src/main/resources/application.properties)
- [UserController.java](./backend/src/main/java/com/co/mybatis/controller/UserController.java)
- [UserService.java](./backend/src/main/java/com/co/mybatis/service/UserService.java)
- [UserMapper.java](./backend/src/main/java/com/co/mybatis/mapper/UserMapper.java)
- [UserMapper.xml](./backend/src/main/resources/mapper/UserMapper.xml)

## Verification

Spring Boot 실행 후 아래 endpoint를 호출해 MySQL의 `testDB.user` 조회 결과가 JSON으로 반환되는 것을 확인했습니다.

```http
GET http://localhost:8081/users
```

확인한 항목:

- Spring Boot가 port `8081`에서 정상 실행
- MySQL datasource 연결 성공
- MyBatis `findAll()` 쿼리 실행
- `/users` 요청에 JSON 응답 반환

## Troubleshooting

### MySQL authentication error

첫 `/users` 호출에서 아래 오류가 발생했습니다.

```text
Access denied for user 'root'@'localhost' (using password: YES)
```

DB 서버나 JDBC 설정이 아니라 IntelliJ Run Configuration의 비밀번호 입력값이 잘못된 것이 원인이었습니다.
환경변수를 수정하고 애플리케이션을 재시작한 뒤 정상 조회를 확인했습니다.

## Environment

- Windows 10
- Java 17
- Spring Boot 3.5.4
- MyBatis
- MySQL 8.0
- React 19 / Vite
- Node.js 24
- npm 11

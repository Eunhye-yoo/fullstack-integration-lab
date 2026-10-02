# Lab 02. Linux 3-Tier Integration with NAT Router

React · Spring Boot · MySQL을 각각 별도의 Ubuntu VM으로 분리하고,  
Linux NAT Router를 추가하여 **Network → Frontend → Backend → Database** 전체 통신 경로를 직접 구성한 실습입니다.

1차 Windows 환경의 `localhost` 기반 연동을 실제 서버 분리 환경의 **IP 기반 통신 구조**로 확장했습니다.

---

## Overview

### Provided Mission

- Ubuntu 22.04 기반 React / Spring Boot / MySQL 서버 분리
- React: `10.10.0.10`
- Spring Boot: `10.10.0.11`
- MySQL: `10.10.0.12`
- Linux 환경에서 Frontend → Backend → Database 연동 검증
- `testDB.sql`을 SCP로 전달하여 DB 구성

### Extended / My Work

기본 3-VM 구성에 다음을 추가했습니다.

- 별도 **Linux NAT Router** 구축
- 내부 서버망과 외부망 분리
- Static IP / Default Gateway 설계
- IPv4 Forwarding + NAT MASQUERADE
- SSH / SCP 기반 원격 접근
- MySQL Remote Access 구성
- Windows Host → React Server DNAT Port Forwarding
- End-to-End CRUD 검증

---

## Architecture

```text
Windows Host
      │
      │ 192.168.5.0/24
      ▼
VMnet8 (VMware NAT)
      │
      ▼
Linux NAT Router
WAN : 192.168.5.x/24
LAN : 10.10.0.1/8
      │
      │ VMnet2 / 10.0.0.0/8
      │
 ┌────┴──────────┬─────────────┐
 ▼               ▼             ▼
React          Spring Boot     MySQL
10.10.0.10     10.10.0.11     10.10.0.12
:5173          :8081           :3306
```

| Server | Role | Address |
|---|---|---|
| NAT Router | Gateway / NAT | `10.10.0.1/8` + `192.168.5.x/24` |
| React | Frontend | `10.10.0.10:5173` |
| Spring Boot | Backend API | `10.10.0.11:8081` |
| MySQL | Database | `10.10.0.12:3306` |

![NAT Router interfaces](./docs/images/03-router-interfaces.png)

---

## Key Design Decisions

### 1. Why an Internal Network?

홈 환경에서 VMware Bridged Network를 테스트했을 때 VM이 외부 네트워크의 IP를 직접 할당받는 것을 확인했습니다.

실습 조건상 방화벽을 비활성화해야 했기 때문에 React / Spring / DB VM을 외부망에 직접 노출하는 대신:

```text
Internal VMnet2
+
Linux NAT Router
+
VMnet8 NAT
```

구조로 분리했습니다.

이를 통해 Application Server는 내부망에 유지하면서도 Router를 통해 인터넷 접근이 가능하도록 구성했습니다.

---

### 2. Why Static IP?

Frontend, Backend, Database가 서로의 주소를 직접 참조하므로 서버 주소가 변경되지 않도록 역할별 IP를 고정했습니다.

```text
React   → 10.10.0.10
Spring  → 10.10.0.11
MySQL   → 10.10.0.12
Gateway → 10.10.0.1
```

같은 `10.0.0.0/8` 내부 통신은 직접 이루어지고, 외부 네트워크로 향하는 트래픽만 Default Gateway인 `10.10.0.1`을 사용합니다.

---

### 3. Linux Router & NAT

Linux가 LAN에서 받은 패킷을 WAN으로 전달하도록 IPv4 Forwarding을 활성화하고, 내부 사설 IP를 Router WAN 주소로 변환하도록 NAT를 구성했습니다.

```bash
sudo iptables -t nat -A POSTROUTING \
  -s 10.0.0.0/8 \
  -o ens37 \
  -j MASQUERADE
```

WAN 주소가 DHCP로 할당되므로 고정 SNAT 대신 현재 Interface IP를 사용하는 `MASQUERADE` 적용.

![NAT traffic verification](./docs/images/07-nat-traffic-verification.png)

---

## Application Integration

### Spring Boot → MySQL

MySQL은 별도 DB VM에서 실행하므로 `localhost`가 아닌 실제 DB Server IP를 사용했습니다.

```text
Spring Boot
10.10.0.11
      ↓ TCP 3306
MySQL
10.10.0.12
```

Application 전용 DB 계정도 Spring Server에서만 접속할 수 있도록 제한했습니다.

```sql
'springapp'@'10.10.0.11'
```

DB Credential은 Source Code에 직접 저장하지 않고 환경변수로 주입했습니다.

```bash
export DB_URL='jdbc:mysql://10.10.0.12:3306/testDB'
export DB_USERNAME='springapp'
export DB_PASSWORD='<LOCAL_SECRET>'
```

![Spring to DB connectivity](./docs/images/12-spring-db-connectivity.png)

---

### Spring Boot Runtime

Maven Wrapper로 Backend 실행 후 Tomcat `8081`과 MySQL Connection Pool 초기화 확인.

![Spring Boot runtime](./docs/images/13-spring-boot-runtime.png)

React Server에서 직접 API 요청도 검증했습니다.

```bash
curl http://10.10.0.11:8081/users
```

![API verification](./docs/images/14-api-verification.png)

---

### React → Spring Boot

1차 Windows Lab에서는 두 Application이 같은 PC에 있어:

```javascript
target: 'http://localhost:8081'
```

을 사용했지만, 이번에는 별도 VM이므로 Spring Server의 실제 주소로 변경했습니다.

```javascript
server: {
  proxy: {
    '/users': {
      target: 'http://10.10.0.11:8081',
      changeOrigin: true
    }
  }
}
```

React Server의 `localhost`는 **React VM 자기 자신**을 의미하므로 Remote Backend 연결에는 사용할 수 없습니다.

Vite는 외부 Interface에서도 요청을 받을 수 있도록 실행했습니다.

```bash
npm run dev -- --host 0.0.0.0
```

![React Vite runtime](./docs/images/15-react-vite-runtime.png)

---

## DNAT / Port Forwarding

Windows Host는 VMnet2 내부망에 직접 연결되어 있지 않으므로 NAT Router의 `5173` 포트를 내부 React Server로 전달했습니다.

```bash
sudo iptables -t nat -A PREROUTING \
  -i ens37 \
  -p tcp \
  --dport 5173 \
  -j DNAT \
  --to-destination 10.10.0.10:5173
```

```text
Windows Browser
      ↓
Router WAN :5173
      ↓ DNAT
React 10.10.0.10:5173
```

![React port forwarding](./docs/images/16-react-port-forward.png)

---

## End-to-End Flow

```text
Windows Browser
       ↓
NAT Router
       ↓ DNAT
React / Vite
10.10.0.10:5173
       ↓ Proxy
Spring Boot
10.10.0.11:8081
       ↓ JDBC / MyBatis
MySQL
10.10.0.12:3306
```

최종적으로 Browser에서 사용자 조회·생성·수정·삭제를 수행하고 MySQL의 실제 Data와 비교하여 전체 CRUD 흐름을 검증했습니다.

![End-to-end CRUD verification](./docs/images/17-linux-crud-verification.png)

---

## Verification

| Check | Result |
|---|---|
| React / Spring / DB 내부 통신 | PASS |
| Internal VM → Gateway | PASS |
| Linux Router → Internet NAT | PASS |
| SSH / SCP 파일 전달 | PASS |
| Spring → Remote MySQL | PASS |
| Spring Boot API :8081 | PASS |
| React → Spring API | PASS |
| Windows → Router → React DNAT | PASS |
| End-to-End CRUD | PASS |

---

## Troubleshooting

### 1. Netplan / cloud-init 충돌

`netplan apply` 직후에는 NIC가 정상 동작했지만 reboot 후 Interface가 다시 DOWN되고 `50-cloud-init.yaml`이 재생성되는 문제 발생.

Clone된 Ubuntu에서 cloud-init이 Network 설정을 다시 생성하면서 직접 작성한 Netplan과 충돌하는 것이 원인이었습니다.

실습 VM에서는 Network 설정을 직접 관리하도록 cloud-init을 비활성화하여 해결했습니다.

```bash
sudo touch /etc/cloud/cloud-init.disabled
sudo rm -f /etc/netplan/50-cloud-init.yaml
```

---

### 2. GitHub 접속 실패 원인 분리

```text
Could not resolve host: github.com
```

오류가 발생했지만 `8.8.8.8`에도 접근할 수 없었기 때문에 DNS 문제가 아니라 그 이전 단계인 Gateway / Router 문제로 판단했습니다.

```text
Link
→ IP
→ Gateway / Route
→ NAT
→ DNS
→ Application
```

순서로 확인하여 NAT Router NIC DOWN 상태를 원인으로 확인했습니다.

---

### 3. `localhost`의 의미

Spring Server에서 `sudo mysql`을 실행하면 Remote DB가 아니라 Spring VM 자신의 Local MySQL을 찾습니다.

Remote Server 접근에는 대상 Host를 명시해야 했습니다.

```bash
mysql -h 10.10.0.12 -u springapp -p
```

이번 실습을 통해 분리 서버 환경에서는 **`localhost = 현재 명령을 실행하는 서버 자신`**이라는 점을 실제 연결 오류를 통해 확인했습니다.

---

## What I Learned

이번 실습에서 Application 연동뿐 아니라 각 요청이 실제로 어떤 Network 경로를 통과하는지 연결해서 이해했습니다.

```text
Static IP
→ Subnet
→ Default Gateway
→ Routing
→ IP Forwarding
→ NAT
→ Port Forwarding
→ Application Proxy
→ Backend
→ Database
```

특히 `localhost`에서 정상 동작하는 Application을 별도 서버로 분리했을 때 필요한 **IP, Route, Port, Service Listening Address, DB 권한**의 관계를 직접 확인했습니다.

---

## Detailed Lab Notes

전체 구축 과정과 사용한 명령어, Netplan 설정, SSH/SCP, MySQL Remote Access, NAT 구성 및 각 명령의 의미는 별도 Infrastructure Lab에 상세히 기록했습니다.

[View detailed Infrastructure Lab notes](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175)
# Full-Stack Integration Lab

Hands-on labs connecting **frontend, backend, database, Linux servers, network paths, and REST API request flows**.

The repository starts with local application integration and progressively expands the same flow into separated Linux servers, routed network environments, and middleware/API labs.

> Detailed infrastructure build notes, commands, verification screenshots, and troubleshooting records are maintained in the [Notion Infrastructure Lab](https://app.notion.com/p/Infrastructure-Lab-3dd1b198732a8059b1b1f2f410f08dc6?source=copy_link).

## Labs

| Lab | Focus | Key Verification |
| --- | --- | --- |
| [01 · React + Spring Boot + MySQL](./01-react-spring-db-windows) | React · Vite Proxy · Spring Boot · MyBatis · MySQL 8 | Browser ↔ API ↔ DB CRUD |
| [02 · Linux 3-Tier + NAT Router](./02-linux-3tier) | Ubuntu VMs · Static IP · Linux Routing/NAT · SSH/SCP · DNAT | Windows → Router → React → Spring Boot → MySQL |
| [03 · Express REST API & Middleware](./03-express-rest-api-middleware) | Node.js · Express · Routing · Middleware · Postman · REST API | Query / Params / Body → HTTP Response |

## GitHub ↔ Notion Navigation

The two indexes use different numbering; each pair below records the same mission from application and infrastructure perspectives.

| Application / GitHub | Environment / Notion |
| --- | --- |
| [GitHub 02 · Linux 3-Tier](./02-linux-3tier/) | [Notion 03 · Linux 3-Tier + NAT Router](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175) |
| [GitHub 03 · Express REST API](./03-express-rest-api-middleware/) | [Notion 04 · Express REST API & Middleware](https://app.notion.com/p/3ed1b198732a8195bf58df22d368f5c9) |

GitHub 01 contains the React/Spring source reused for the Linux lab. GitHub 02 contains deployment evidence; GitHub 03 includes the uploaded Express source. The VyOS/FastAPI/MariaDB Notion lab is currently planned and has no matching completed application lab here.

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

- Application integration across frontend, backend, and database layers
- IP-based communication between separated servers
- Static IP, default gateway, routing, IPv4 forwarding, and NAT
- SSH/SCP and VS Code Remote SSH
- DNAT / port forwarding for external-to-internal access
- REST API routing and HTTP method handling
- Query Parameter, Path Parameter, Request Body processing
- Middleware execution flow and response formats
- Layer-by-layer verification and troubleshooting

## Tech

`React` `Vite` `Java 17` `Spring Boot` `MyBatis` `MySQL` `Node.js` `Express.js` `EJS` `Postman` `Linux` `VMware` `iptables` `SSH/SCP`

## Documentation

- [Lab 01 README](./01-react-spring-db-windows/README.md)
- [Lab 02 README](./02-linux-3tier/README.md)
- [Lab 03 README](./03-express-rest-api-middleware/README.md)
- [Notion Infrastructure Lab](https://app.notion.com/p/Infrastructure-Lab-3dd1b198732a8059b1b1f2f410f08dc6?source=copy_link)

This repository will continue to grow with additional integration and infrastructure labs.

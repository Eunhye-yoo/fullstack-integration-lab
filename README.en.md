# Full-Stack Integration Lab

[한국어](./README.md)

Labs connecting React, APIs, databases, and Linux servers. I adapted the database/proxy settings, separated application layers into VMs, and checked API responses alongside browser and DB results.

## Linux 3-Tier & NAT Router

**React, Spring Boot, and MySQL on separate Ubuntu VMs, connected through a Linux NAT router.**

- Static IPs/default gateways and IP forwarding
- Outbound NAT with MASQUERADE; inbound access with DNAT
- SSH/SCP for remote access and file transfer
- Spring-to-MySQL connection using a host-scoped application account
- Gateway/DNS, Vite proxy, and DB connection troubleshooting

[Configuration and application tests](./02-linux-3tier/README.md) · [Commands and network troubleshooting](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175)

## Labs

| Lab | Work and checks |
| --- | --- |
| [01 · React + Spring Boot + MySQL](./01-react-spring-db-windows/README.md) | Adapted provided examples to local MySQL; checked CRUD and corrected an edit-request URL |
| [02 · Linux 3-Tier](./02-linux-3tier/README.md) | Server separation, NAT/DNAT, SSH/SCP, browser-to-DB integration |
| [03 · Express API](./03-express-rest-api-middleware/README.md) | Query/path/body handling, middleware order, Postman request/response checks |

Lab 01 holds the React/Spring source reused in Lab 02. Lab 02 holds deployment records and screenshots; Lab 03 contains the Express source.

## Documentation

GitHub contains application configuration, source, and API/DB screenshots. Notion contains VM/network settings, commands, and troubleshooting.

| GitHub | Notion |
| --- | --- |
| [Linux 3-Tier](./02-linux-3tier/) | [Lab 03 · Linux 3-Tier + NAT Router](https://app.notion.com/p/3ed1b198732a815091d2e0030512f175) |
| [Express API](./03-express-rest-api-middleware/) | [Lab 04 · Express API & Middleware](https://app.notion.com/p/3ed1b198732a8195bf58df22d368f5c9) |

[Infrastructure Lab index](https://app.notion.com/p/3dd1b198732a8059b1b1f2f410f08dc6)

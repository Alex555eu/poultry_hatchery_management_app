# Poultry Hatchery Management Application

## Overview
The Poultry Hatchery Management Application is designed as a web-based system following a client-server architecture. The system is divided into two independent layers: the frontend (client) and the backend (server), allowing parallel development and maintenance.
The frontend and backend communicate via a REST API over HTTP.

## Features
- 🏢 **Hatchery Management** – Register and configure new hatcheries and users.  
- 🔑 **User Authentication** – Secure login for registered users.  
- 📦 **Batch Registration** – Record new bird egg deliveries and manage supplier data.  
- 🛠 **Egg Processing** – Track egg placement on incubation carts and log losses.  
- 📊 **Real-Time Monitoring** – Supervise the current status of egg batches.  
- 📅 **Task Scheduling** – Create, manage, and integrate automated task progress updates.  
- 📈 **Process Supervision** – Monitor task completion in real time.  
- 💡 **Special Processes Support** – Manage processes like egg candling and reject tracking.  
- 🔄 **Hatch Cycle Completion** – Summarize and finalize hatch cycles.  
- ⚠ **Incident Logging** – Record damages occurring outside standard process losses.  

## Used Technologies (with key libraries)
**Angular (TypeScript):** `Angular Material`, `RxJS`

**Spring Boot (Java):** `Spring Web`, `Spring Security`, `Spring Data JPA`, `JJWT`

**PostgreSQL**

## Authentication and Security

### JWT-based Authentication

The application uses JSON Web Tokens (JWT) for authentication and access control. Each token has a defined expiration time to balance security and usability.

#### Security Measures:
- **Short-lived access tokens**: Prevent prolonged unauthorized access.
- **Refresh tokens**: Allow session continuity without frequent logins.
- **Secure password storage**: Uses hashing algorithms like bcrypt.

### HTTP Interceptor for Token Management

To enhance security and improve user experience, an HTTP request interceptor is implemented on the frontend.

#### Functions:
- **Attaches JWT tokens** to outgoing requests (except authentication-related ones).
- **Handles token expiration** by intercepting `401 Unauthorized` errors and attempting a token refresh.
- **Maintains session** when successfully refreshing the token, which results in the re-execution of the original request, ensuring a smooth user experience with the application.
- **Logs out users** if both access and refresh tokens are invalid, redirecting them to the login page.


##
https://github.com/user-attachments/assets/8dff07fb-a152-439f-90b9-2582cafe9e31

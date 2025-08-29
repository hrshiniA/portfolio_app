# Portfolio Management Dashboard

## 1. Introduction

### Overview
The **Portfolio Management Dashboard** is a web-based application that enables users to manage their investment portfolios with features like user authentication, portfolio overview, transaction history, and the ability to add or edit investments. The application is containerized using Docker for seamless deployment and scalability.

### Purpose
This dashboard showcases proficiency in full-stack development, including front-end and back-end integration, database management, and containerization. It serves as a prototype for a financial management tool, meeting the assessment's requirements while prioritizing security and usability.

### Technology Stack
| Component       | Technology            |
|-----------------|-----------------------|
| **Front-end**   | React.js, React Router, Axios |
| **Back-end**    | Node.js, Express.js, SQLite3, JWT |
| **Database**    | SQLite (stored in `portfolio.db`) |
| **Containerization** | Docker |

## 2. Setup

### Prerequisites
Before setting up the project, ensure you have the following installed:
- **Docker**: [Download](https://www.docker.com/get-started)
  - Verify with `docker --version` and `docker-compose --version`.

### Installation
**Step 1: Clone the Repository**
```
git clone https://github.com/hrshiniA/portfolio_app.git
```

**Step 2: Set Up Environment Variables**
- Create a `.env` file in the backend directory of the project.
- Add the following line with a secure, unique secret key:
  ```
  JWT_SECRET=your-secure-secret-key
  ```
  - Replace `your-secure-secret-key` with a random string

**Step 3: Build and Run with Docker Compose**
1. Build and start the application using Docker Compose:
   ```
     docker-compose up --build
   ```
- This command builds the back-end and front-end images and starts the services.
- The front-end is served on `http://localhost:3000/`, and the back-end runs on port 5000 internally.
- The `portfolio.db` file is persisted using a Docker volume.

2. Verify the application is running:
- Open `http://localhost:3000/` in your browser. The login page should load.

**Step 4: Stop the Containers**
- To stop the application, press `Ctrl+C` in the terminal.

## 3. Features

### User Authentication
- **Login**: Users can log in with a registered username and password to access the dashboard.
- **Registration**: New users can create an account via the registration page.
- **Logout**: Users can log out, clearing the JWT and returning to the login page.
- **Security**: Authentication is secured with JWT, requiring a `JWT_SECRET` environment variable.

### Portfolio Overview
- Displays a table of investments with the following details:
  - Name
  - Type (e.g., stock, bond, mutual fund)
  - Current Value
  - Purchase Price
  - Performance (% change)
- Accessible only to authenticated users.

### Transaction History
- Provides a log of all buy/sell transactions associated with the user’s portfolio.
- Includes details such as transaction date, type (buy/sell), and amount.

### Add/Edit Investments
- **Add Investment**: Users can add new investments by entering name, type, current value, purchase price, and quantity.
- **Edit Investment**: Users can modify existing investments with the same fields.
- Each action logs a corresponding transaction (e.g., a "buy" transaction).

### Responsive Design
- Basic styling with a focus on usability, using CSS for layout and decorative elements.

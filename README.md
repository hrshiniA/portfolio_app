Portfolio Management Dashboard
1. Introduction
Overview
The Portfolio Management Dashboard is a web-based application. This project provides a platform for users to manage their investment portfolios, featuring user authentication, a portfolio overview, transaction history, and the ability to add or edit investments. The application is built with a modern technology stack and containerized using Docker for easy deployment and scalability.
Purpose
This dashboard demonstrates proficiency in full-stack development, including front-end and back-end integration, database management, and containerization. It serves as a prototype for a financial management tool, adhering to the assessment requirements while maintaining security and usability.
Technology Stack

Front-end: React.js with React Router for navigation and Axios for API requests.
Back-end: Node.js with Express.js for the server, SQLite3 for the database, and JWT for authentication.
Database: SQLite (relational database) stored in a portfolio.db file.
Containerization: Docker for packaging and deployment.

2. Setup
Prerequisites
Before setting up the project, ensure you have the following installed:

Docker: Download

Verify installation with docker --version and docker-compose --version.



Project Structure
textportfolio_management_dashboard/
├── backend/
│   ├── index.js           # Back-end server logic
│   ├── package.json      # Back-end dependencies
│   └── portfolio.db      # SQLite database file (persisted via volume)
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component and routing
│   │   ├── Login.js      # Login page component
│   │   ├── Register.js   # Registration page component
│   │   ├── Dashboard.js  # Portfolio overview component
│   │   ├── Transactions.js # Transaction history component
│   │   ├── AddEditInvestment.js # Add/Edit investment component
│   │   ├── Login.css     # Styles for Login and Register pages
│   │   └── Register.css  # Styles for Register page
│   ├── package.json      # Front-end dependencies
│   └── public/           # Static files (e.g., index.html)
├── Dockerfile            # Docker configuration for the back-end
├── docker-compose.yml    # Docker Compose configuration
├── README.md             # This file
└── .env                  # Environment variables (e.g., JWT_SECRET) - user-provided
└── .gitignore            # Git ignore file
Installation
Step 1: Clone the Repository
bashgit clone https://github.com/your-username/portfolio-management-dashboard.git
cd portfolio_management_dashboard
Step 2: Set Up Environment Variables

Create a .env file in the root directory of the project (where docker-compose.yml resides).
Add the following line with a secure, unique secret key:
textJWT_SECRET=your-secure-secret-key

Replace your-secure-secret-key with a random string (e.g., generated using openssl rand -base64 32 on the command line).


Ensure the .env file is not committed to version control (it is listed in .gitignore).

Important: The JWT_SECRET must be set before building or running the application with Docker to ensure secure JWT authentication. Failure to provide a JWT_SECRET will result in authentication errors.
Step 3: Build and Run with Docker Compose

Build and start the application using Docker Compose:
bashdocker-compose up --build

This command builds the back-end and front-end images and starts the services.
The front-end is served on http://localhost:3000/, and the back-end runs on port 5000 internally.
The portfolio.db file is persisted using a Docker volume.


Verify the application is running:

Open http://localhost:3000/ in your browser. The login page should load.



Step 4: Stop the Containers

To stop the application, press Ctrl+C in the terminal, or run:
bashdocker-compose down

To remove the containers, networks, and volumes (including the database), use:
bashdocker-compose down -v

Note: This will delete the portfolio.db data unless backed up.



3. Features
User Authentication

Login: Users can log in with a registered username and password to access the dashboard.
Registration: New users can create an account via the registration page.
Logout: Users can log out, clearing the JWT and returning to the login page.
Security: Authentication is secured with JWT, requiring a JWT_SECRET environment variable.

Portfolio Overview

Displays a table of investments with the following details:

Name
Type (e.g., stock, bond, mutual fund)
Current Value
Purchase Price
Performance (% change)


Accessible only to authenticated users.

Transaction History

Provides a log of all buy/sell transactions associated with the user’s portfolio.
Includes details such as transaction date, type (buy/sell), and amount.

Add/Edit Investments

Add Investment: Users can add new investments by entering name, type, current value, purchase price, and quantity.
Edit Investment: Users can modify existing investments with the same fields.
Each action logs a corresponding transaction (e.g., a "buy" transaction).

Responsive Design

Basic styling with a focus on usability, using CSS for layout and decorative elements.

Additional Notes
Troubleshooting

Application Not Starting:

Ensure port 3000 is free (netstat -a -n | find "3000" on Windows).
Verify the .env file contains JWT_SECRET.


Authentication Errors:

Check that JWT_SECRET is set in the .env file and matches the value used during registration/login.


Database Issues:

If the database fails to initialize, remove the volume with docker-compose down -v and restart.



Contributing
This project is for assessment purposes only. Do not share or distribute the code or business case materials outside the interview process.
License
This project is confidential and intended for personal use in the Technology Industrial Placement Program 2025 - Assessment. No license is provided.
Acknowledgements

Built with guidance from xAI's Grok.
Icons and styling inspired by Manulife branding guidelines.

Version History

v1.0.0 (August 29, 2025): Initial release with all core features and Docker-only setup.

Contact
For questions, contact your assessment coordinator or refer to the program guidelines.

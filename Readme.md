# ISYS-2099 Database Application - Database Project - Group 4

---

## Project Structure
Backend Folder: This contains the server application. There are 5 main directories: 
Controller: This handles all business logic
Router: This handles requests and responses
Models: This provides interface to interact with the MySQL database
MongodbRepo: This provides interface to interact with mongoDB


Database Folder: All queries used to construct the database could be found here
The trigger folder contains all triggers created
the procedure folder contains all stored procedures used in the database
the table creation file contains the queries to build the database

Frontend Folder
Resources Folder: This contain the official relational schema and the mock data

## Technology Stack

- Database: MySQL and MongoDB.
- Backend API Server: NodeJS, Express, and Mongoose.
- Frontend: React, Tailwind CSS, and Axios.

## Dependencies

| Dependency                                                                 | Version  |
|:---------------------------------------------------------------------------|:--------:|
| [NodeJS](https://nodejs.org/)                                              | 18.\*.\* |
| [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)           |  8.0.33  |
| [MySQL Shell](https://dev.mysql.com/downloads/shell/)                      |  8.0.33  |
| [MongoDB Community Server](https://www.mongodb.com/try/download/community) |  6.0.\*  |

## Installation

### Database:

#### MySQL:


#### MongoDB:

### Backend API server in `backend`:

```bash
cd backend
npm install
npm start
 ```

### Frontend client in `frontend`:

```bash
cd frontend
npm install
npm start
```

## Usage


## Contribution

| SID      | Name                 | Score |
|:---------|:---------------------|:-----:|
| 3679813  | Luong Thanh Trung    |   5   |
| 4019811  | Pham Nhat Minh       |   5   |
| 3989037  | Ly Minh Khoi         |   5   |
| 3877818  | Hoang Dinh Tri       |   5   |
| 4118015  | Eduardo Salcedo Fuentes |   5   |

## Developer Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![MySQL Workbench](https://img.shields.io/badge/MySQL_Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB Compass](https://img.shields.io/badge/MongoDB_Compass-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

# Backend Setup

In order to run the backend in your terminal:

cd backend
npm i
npm start

## Guide to test the APIS in Postman:

The list of accounts has been provided in the Login Folder

## For the Get All Patients API: Please use the credential of the front desl

## For the Retrieve and Filter and Sort a List of Staff API, please use the HR account. You can also use any other account, but the hr and doctor account is recommended

## Wage Change - Department Change - Job Change APIS: Please use the provided HR credentials for these.

## Scheduling API: Please use the provided doctor account

## Training Material API: Please log in using the credential of the HR if you want to use the POST request. Otherwise, you can use any credential for the GET request, but it is recommended to use the doctor credential.

## Qualifications API: Please log in using the credential of the HR if you want to use the POST request. Otherwise, you can use any credential for the GET request, but it is recommeded to use the doctor credential

## Performance Evaluation API: You can log in using any credential, but it is recommended to log in using the provided doctor credential.

## Prescription APIs - Diagnoses APIs - Allergies APIs - test APIS (Except the PUT request): Please log in using the doctor credential. The nurse account only allows the use of GET requests and the test folder's PUT request 

## Billings API: Please log in using the credentials of the business officer

## Appointments API: Please log in using the credentials of the front desk


# Authenticate Folder
The Authenticate folder contains files related to user authentication. Below is a description of each file:

## authenticateController.js 
This file contains the controller functions for handling authentication-related requests. It includes functions such as:

loginPage: Renders the login page.
login: Handles user login by authenticating credentials.

registerPage: Renders the registration page.
register: Handles registration.

logout: Handle the logout action.


## authenticateMiddleware.js
This file contains middleware functions used in the authentication process. Middleware functions are executed before the final request handler and can be used for tasks such as:

Checking if a user is authenticated before allowing access to certain routes.
Handling errors related to authentication.


## passportConfig.js
This file contains the configuration for Passport.js, a popular authentication middleware for Node.js. It includes:

Strategies for authenticating users (e.g., local strategy for username and password).
Serialization and deserialization of user information to maintain session data.
authRoutes.js
This file defines the routes related to authentication. It maps HTTP requests to the appropriate controller functions. For example:

GET /login: Maps to loginPage function in authenticateController.js.
POST /login: Maps to login function in authenticateController.js.


## In Progress Work
Testing the Register function
Testing the Login function
Testing the Logout function 


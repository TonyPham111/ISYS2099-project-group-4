
# Backend Setup

In order to run the backend in your terminal:

cd backend
npm i
npm start


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
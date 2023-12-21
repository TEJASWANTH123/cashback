# Google Pay Clone

This project is a simplified clone of Google Pay, implemented in Node.js with Express and MongoDB. It allows users to log in, transfer money, and view transaction history. Cashback is provided based on certain conditions.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Sample Requests (curl)](#sample-requests-curl)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication based on phone number
- Money transfer between users
- Cashback on transactions
- Transaction history for users

## Installation
1. Clone the repository:

    ```bash
    git clone https://github.com/TEJASWANTH123/cashback.git
    cd cashback
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your MongoDB connection by updating the `dbURI` in `index.js` with your MongoDB connection string.

4. Start the server:

    ```bash
    npm start
    ```

## Usage
- Register/Login using a phone number.
- Add an initial amount to your wallet after the first login.
- Transfer money to other users.
- View transaction history.

## Endpoints
- **POST /users/login**
  - Log in or register a user.

- **POST /users/add-amount**
  - Add an initial amount to the user's wallet (protected with JWT).

- **POST /transactions/transfer**
  - Transfer money from one user to another.

- **GET /transactions/history/:phoneNum**
  - View transaction history for a user.

## Sample Requests (curl)
Assuming your server is running at `http://localhost:3000`:

```bash
# Login
curl -X POST -H "Content-Type: application/json" -d '{"phoneNum": "9876543210"}' http://localhost:3000/users/login

# Add Amount (protected with JWT)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <your_token>" -d '{"phoneNum": "9876543210", "initialAmount": 100}' http://localhost:3000/users/add-amount

# Transfer
curl -X POST -H "Content-Type: application/json" -d '{"from": "9876543210", "to": "1234567890", "amount": 50}' http://localhost:3000/transactions/transfer

# Get Transaction History
curl http://localhost:3000/transactions/history/9876543210

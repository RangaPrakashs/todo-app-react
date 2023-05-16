## Todo Server Application

This is a backend server application for a Todo app with JWT Validation with PKCE. It uses Okta for user authentication and manages Todo items for each user.

## Prerequisites

    Node.js installed. If you don't have it, you can download it from here.
    An Okta developer account. You can create one for free here.

Setup Steps

Clone this repository to your local machine.

```bash
git clone <repository-url>
```

Navigate to the server directory.

```bash
cd server
```

Install the required dependencies.

```bash
npm install
```

Create a .env file in the root directory of the server application (same level as your package.json). Fill it with your Okta details in the following format:

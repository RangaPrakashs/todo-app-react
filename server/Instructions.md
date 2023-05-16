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


## Running the Server 


```bash
npm run server
```

You will get a message with  Server is running on port 8080, you can control this via server_config.js file located in the same directory.

## testenv Setup (Important)
Create a testenv file in the root directory of the server application (same level as your server.js). Fill it with your Okta details in the following format:

you would need to create the testenv without extensions and add the below information for your server to get this app working as expected.


````bash
ISSUER=https://{oktadomain}/oauth2/default
CLIENT_ID={Resource Server Client ID}
CLIENT_SECRET={Client Secret}
SPA_CLIENT_ID ={Single page app client id}```
````

##

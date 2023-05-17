# Okta React + Custom Login Example = Todo App with Authentication.

This example is a forked version of okta react sample, you can read more about it here - https://developer.okta.com/code/react/#get-started-with-react-okta  

This example is built with Create React App and Okta Sample

## Prerequisites

Before running this sample, you will need the following:

* An Okta Developer Account, you can sign up for one at https://developer.okta.com/signup/.
* An Okta Application, configured for Single-Page App (SPA) mode. This is done from the Okta Developer Console, you can see the [OIDC SPA Setup Instructions][].  When following the wizard, use the default properties.  They are are designed to work with our sample applications.

## Running This Example

To run this application, you first need to clone this repo:

```bash
git clone https://github.com/okta/samples-js-react.git
```

Then install dependencies:

```bash
npm install
```

Enter into custom-login directory:

```bash
cd todo-app-react
```

Now you need to gather the following information from the Okta Developer Console:

* **Client Id** - The client ID of the SPA application that you created earlier. This can be found on the "General" tab of an application, or the list of applications.  This identifies the application that tokens will be minted for.
* **Issuer** - This is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`.

* **PORT** - This is the port the react app will run on  - ensure its different one from your resource server.

These values must exist as environment variables. They can be exported in the shell, or saved in a file named `testenv`, at the root of this repository. (This is the parent directory, relative to this README) See [dotenv](https://www.npmjs.com/package/dotenv) for more details on this file format.

```ini
ISSUER=https://yourOktaDomain.com/oauth2/default
CLIENT_ID=123xxxxx123
PORT=3000
```

> NOTE: If you are running the sample against an org that has [Okta's Identity Engine](https://developer.okta.com/docs/concepts/ie-intro/) enabled, you will need to add the following environment variable to your `testenv` file
> USE_INTERACTION_CODE=true
With variables set, start the app server:

```bash
npm start
```
Now navigate to http://localhost:3000 in your browser.

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will render a custom login page component that uses the Okta Sign-In Widget to perform authentication.

You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

**Note:** If you are currently using your Developer Console, you already have a Single Sign-On (SSO) session for your Org.  You will be automatically logged into your application as the same user that is using the Developer Console.  You may want to use an incognito tab to test the flow from a blank slate.


# Server

To navigate to the "server/" folder, ensure that the server is running on the port specified in the config file, and read the "instructions.md" file located in the server folder to learn more about running the resource server.




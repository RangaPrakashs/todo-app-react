import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import { Container } from "semantic-ui-react";
import config from "../okta_config";
import Home from "./Home";
import CustomLoginComponent from "../okta-components/Login";
import Navbar from "./Navbar";
import CorsErrorModal from "../okta-components/CorsErrorModal";
import AuthRequiredModal from "../okta-components/AuthRequiredModal";

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
	const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
	const [authRequiredModalOpen, setAuthRequiredModalOpen] =
		React.useState(false);

	const history = useHistory(); // example from react-router

	const triggerLogin = () => {
		// Redirect to the /login page that has a CustomLoginComponent
		history.push("/login");
	};

	const restoreOriginalUri = async (_oktaAuth, originalUri) => {
		history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
	};

	const customAuthHandler = async () => {
		const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
		if (!previousAuthState || !previousAuthState.isAuthenticated) {
			// App initialization stage
			triggerLogin();
		} else {
			// Ask the user to trigger the login process during token autoRenew process
			setAuthRequiredModalOpen(true);
		}
	};

	const onAuthResume = async () => {
		history.push("/login");
	};

	return (
		<Security
			oktaAuth={oktaAuth}
			onAuthRequired={customAuthHandler}
			restoreOriginalUri={restoreOriginalUri}>
			<Navbar {...{ setCorsErrorModalOpen }} />
			<CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
			<AuthRequiredModal
				{...{ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }}
			/>
			<Container text style={{ marginTop: "7em" }}>
				<Switch>
					<Route path='/' exact component={Home} />
					<Route
						path='/login/callback'
						render={(props) => (
							<LoginCallback {...props} onAuthResume={onAuthResume} />
						)}
					/>
					<Route
						path='/login'
						render={() => (
							<CustomLoginComponent {...{ setCorsErrorModalOpen }} />
						)}
					/>
				</Switch>
			</Container>
		</Security>
	);
};

export default App;

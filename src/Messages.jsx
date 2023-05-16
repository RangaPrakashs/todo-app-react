/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import { Header, Icon, Message, Table } from "semantic-ui-react";

import config from "../src/okta_config";

const TodoAPI = () => {
	const { authState, oktaAuth } = useOktaAuth();
	const [todos, setTodos] = useState(null);
	const [failedMessage, setFailedMessage] = useState(false);

	// fetch todos
	useEffect(() => {
		if (authState && authState.isAuthenticated) {
			const accessToken = oktaAuth.getAccessToken();
			fetch(config.resourceServer.messagesUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
				.then((response) => {
					if (!response.ok) {
						return Promise.reject();
					}
					return response.json();
				})
				.then((data) => {
					let index = 0;
					const formattedMessages = data.messages.map((message) => {
						const date = new Date(message.date);
						const day = date.toLocaleDateString();
						const time = date.toLocaleTimeString();
						index += 1;
						return {
							date: `${day} ${time}`,
							text: message.text,
							id: `message-${index}`,
						};
					});
					setMessages(formattedMessages);
					setMessageFetchFailed(false);
				})
				.catch((err) => {
					setMessageFetchFailed(true);
					/* eslint-disable no-console */
					console.error(err);
				});
		}
	}, [authState]);
};

export default TodoAPI;

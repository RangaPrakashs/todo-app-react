import { useOktaAuth } from "@okta/okta-react";

import React, { useState, useEffect } from "react";
import { List, Input } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import config from "../okta_config";

const TodoList = ({ userInfo }) => {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");
	const { authState, oktaAuth } = useOktaAuth();

	const handleAddTodo = async () => {
		if (input && input.length && authState && authState.isAuthenticated) {
			const accessToken = await oktaAuth.getAccessToken();
			console.log(input, accessToken, userInfo);
		}
	};

	const fetchTodos = async () => {
		try {
			if (authState && authState.isAuthenticated) {
				const accessToken = await oktaAuth.getAccessToken();

				const response = await axios.get(config.resourceServer.todosUrl, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				console.log(accessToken, userInfo);
				setTodos(response.data);
			}
		} catch (error) {
			console.error("Failed to fetch todos:", error);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleAddTodo();
		}
	};

	useEffect(() => {
		const handleKeyPressEvent = window.addEventListener(
			"keydown",
			handleKeyPress
		);
		fetchTodos();

		return () => {
			window.removeEventListener("keydown", handleKeyPressEvent);
		};
	}, [authState, todos]);

	return (
		<div className='App ui container'>
			<Input
				action={{
					color: "blue",
					labelPosition: "right",
					icon: "add",
					content: "Add",
					onClick: handleAddTodo,
				}}
				value={input}
				onChange={(e) => setInput(e.target.value.trim())}
				placeholder='New task...'
			/>
			<List divided relaxed>
				<h1>Your Todo Items</h1>
				{todos?.map((todo, index) => (
					<div key={index}>{todo}</div>
				))}
			</List>
		</div>
	);
};

export default TodoList;

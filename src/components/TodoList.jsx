import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import {
	List,
	Input,
	Button,
	Popup,
	Icon,
	Divider,
	Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import config from "../okta_config";
import axios from "axios";
import moment from "moment";

const TodoList = ({ userInfo }) => {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");
	const { authState, oktaAuth } = useOktaAuth();

	// Move to api.js
	const fetchTodos = async () => {
		try {
			if (authState && authState.isAuthenticated) {
				const accessToken = await oktaAuth.getAccessToken();
				const response = await axios.get(config.resourceServer.todosUrl, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setTodos(response.data);
			}
		} catch (error) {
			console.error("Failed to fetch todos:", error);
		}
	};

	// Move to api.js
	const addTodo = async () => {
		if (!input.length) {
			return;
		}
		try {
			// refactor this for readablity.
			if (authState && authState.isAuthenticated) {
				const accessToken = await oktaAuth.getAccessToken();
				const response = await axios.post(
					config.resourceServer.todosUrl,
					{
						todo: input, // Use the input state as the todo item
						email: userInfo.email,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				console.log(response.data); // Assuming the response contains the created todo item
				// Add the created todo item to the todos list
				fetchTodos();
				setInput("");
			}
		} catch (error) {
			console.error("Failed to add a todo:", error);
		}
	};

	// Move to api.js
	const deleteTodo = async (id) => {
		try {
			if (authState && authState.isAuthenticated) {
				const accessToken = await oktaAuth.getAccessToken();
				await axios.delete(config.resourceServer.todosUrl, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					data: {
						id,
					},
				});
			}
			fetchTodos();
			// Code to refresh the todo list after deletion
		} catch (error) {
			console.error(`Error deleting todo: ${error}`);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			addTodo();
		}
	};

	useEffect(() => {
		const handleKeyPressEvent = (event) => {
			if (event.key === "Enter") {
				handleKeyPress(event);
			}
		};

		window.addEventListener("keydown", handleKeyPressEvent);
		fetchTodos();

		return () => {
			window.removeEventListener("keydown", handleKeyPressEvent);
		};
	}, []);

	return (
		<div className='ui container'>
			<Segment basic textAlign='center'>
				<Popup
					trigger={
						<Input
							action={{
								color: "blue",
								labelPosition: "right",
								icon: "add",
								content: "Add",
								onClick: addTodo,
							}}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='New task...'
							error={input.trim() === "" && input.length < 3}
							icon={
								<Icon
									name={input.trim() === "" ? "exclamation circle" : "tasks"}
								/>
							}
						/>
					}
					content='Please enter a task.'
					on='click'
					open={input.trim() === ""} // Show the popup if the input is empty
					position='top center'
				/>
			</Segment>
			<List divided relaxed>
				<div className='divider'></div>
				<Divider horizontal>
					<h1>Your Todo Items</h1>
				</Divider>
				{todos
					.slice()
					.reverse()
					.map((todo) => (
						<List.Item key={todo.id}>
							<List.Content>
								<List.Header>{todo.todo}</List.Header>
								<List.Description>
									{moment(todo.timestamp).fromNow()}
								</List.Description>
							</List.Content>
							<Button color='red' onClick={() => deleteTodo(todo.id)}>
								Complete
							</Button>
						</List.Item>
					))}
			</List>
		</div>
	);
};

export default TodoList;

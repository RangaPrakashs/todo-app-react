const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // Use promise version of fs
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const OktaJwtVerifier = require("@okta/jwt-verifier");

// Config
const sampleConfig = require("./server-config");

const app = express();
const PORT = sampleConfig.resourceServer.port || 8080 ;
const DATA_FILE = path.join(__dirname, "db.json");

// Replace with your actual Okta configuration
const oktaJwtVerifier = new OktaJwtVerifier({
	issuer: sampleConfig.resourceServer.oidc.issuer,
	clientId: sampleConfig.resourceServer.oidc.clientId,
});

app.use(cors()); // Add CORS support
app.use(express.json());

function authenticationRequired(req, res, next) {
	const authHeader = req.headers.authorization || "";
	const match = authHeader.match(/Bearer (.+)/);

	if (!match) {
		res.status(401);
		return next("Unauthorized");
	}

	const accessToken = match[1];
	const audience = sampleConfig.resourceServer.assertClaims.aud;
	return oktaJwtVerifier
		.verifyAccessToken(accessToken, audience)
		.then((jwt) => {
			req.jwt = jwt;
			next();
		})
		.catch((err) => {
			res.status(401).send(err.message);
		});
}

async function readTodoItems() {
	try {
		const data = await fs.readFile(DATA_FILE, "utf8");
		if (!data) {
			return []; // Return empty array if file is empty
		}
		return JSON.parse(data);
	} catch (err) {
		if (err.code === "ENOENT") {
			return []; // Return empty array if file doesn't exist
		} else if (err instanceof SyntaxError) {
			//  handle empty files (which are not valid JSON)
			return [];
		} else {
			throw err;
		}
	}
}

async function writeTodoItems(items) {
	try {
		await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
	} catch (err) {
		// Log the error and throw it to allow the caller to handle it
		console.error(`Error writing to file: ${err}`);
		throw err;
	}
}

app.get("/", (req, res, next) => {
	res.send(
		"Your Server is Up and running, hit api/todo with post and get to fetch data from db"
	);
});

app.get("/api/todo", authenticationRequired, async (req, res, next) => {
	try {
		const requester_email = req.jwt ? req.jwt.claims?.sub : "";
		const todoItems = await readTodoItems();
		const filteredItems = todoItems.filter(
			(item) => item.email === requester_email
		);
		console.log(filteredItems);
		res.status(200).json(filteredItems);
	} catch (err) {
		// Setting error status code and passing it to the next middleware
		err.status = 500; // Internal Server Error
		next(err);
	}
});

app.post("/api/todo", authenticationRequired, async (req, res, next) => {
	const { email, todo } = req.body;
	console.log(email, todo);

	if (!email || !todo) {
		return res.status(400).json({ error: "Email and todo are required" });
	}

	const timestamp = new Date().toISOString();
	const newItem = {
		id: uuidv4(),
		email,
		todo,
		timestamp,
	};

	try {
		const todoItems = await readTodoItems();
		todoItems.push(newItem);
		await writeTodoItems(todoItems);
		res.status(201).json(newItem);
	} catch (err) {
		// Set status code to 500 and forward error to error handling middleware
		err.status = 500; // Internal Server Error
		console.log(err, "Writing to file, check if db.json exists!");
		next(err);
	}
});

// Delete a todo from the json.
app.delete("/api/todo", authenticationRequired, async (req, res, next) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ error: "ID is required" });
	}

	try {
		const todoItems = await readTodoItems();
		const initialLength = todoItems.length;

		// Filter out the item with the specified ID
		const updatedItems = todoItems.filter((item) => item.id !== id);

		if (initialLength === updatedItems.length) {
			return res.status(404).json({ error: "No item found with the given ID" });
		}

		await writeTodoItems(updatedItems);
		res.status(200).json({ message: "Todo item deleted successfully" });
	} catch (err) {
		// Set status code to 500 and forward error to error handling middleware
		err.status = 500; // Internal Server Error
		next(err);
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err);
	res
		.status(500)
		.json({ error: `An error occurred, please try again later.${err}` });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

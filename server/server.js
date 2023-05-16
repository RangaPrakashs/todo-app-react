const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // Use promise version of fs
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const OktaJwtVerifier = require("@okta/jwt-verifier");

// Config
const sampleConfig = require("./server-config");

const app = express();
const PORT = 8080;
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
		return JSON.parse(data);
	} catch (err) {
		if (err.code === "ENOENT") {
			return []; // Return empty array if file doesn't exist
		} else {
			throw err;
		}
	}
}

async function writeTodoItems(items) {
	await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

app.get("/", (req, res, next) => {
	res.send(
		"Your Server is Up and running, hit api/todo with post and get to fetch data from db"
	);
});

app.get("/api/todo", authenticationRequired, async (req, res, next) => {
	try {
		const todoItems = await readTodoItems();
		res.json(todoItems);
	} catch (err) {
		next(err);
	}
});

app.post("/api/todo", authenticationRequired, async (req, res, next) => {
	const { email, todo } = req.body;

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
		next(err);
	}
	// simple clean up to handle few edge cases.
	function cleanUpJson(json) {
		// This regular expression matches property names that are not surrounded by double quotes.
		// It then adds the missing quotes.
		const cleaned = json.replace(/([a-zA-Z0-9_$]+)\s*:/g, '"$1":');
		return cleaned;
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "An error occurred, please try again later." });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

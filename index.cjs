require("dotenv").config();
const express = require("express");
const app = express();
var morgan = require("morgan");
// const requestLogger = (request, response, next) => {
//   console.log("[part3]: method:", request.method);
//   console.log("[part3]: path:  ", request.path);
//   console.log("[part3]: body:  ", request.body);
//   console.log("---");
//   next();
// };
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint." });
};

// middleware
app.use(express.static("build"));
app.use(express.json());
// app.use(requestLogger);
// using morgan to log requests
// using a predefined logging format 'tiny'
// app.use(morgan("tiny"));
// using format string of predefined tokens
// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms")
// );
// using custom format function
// app.use(
//   morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       JSON.stringify(req.body),
//     ].join(" ");
//   })
// );
// using morgan custom token
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// database
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "John Lennon",
    number: "123-456-7890",
  },
  {
    id: 6,
    name: "Paul McCartney",
    number: "234-567-8901",
  },
  {
    id: 7,
    name: "George Harrison",
    number: "345-678-9012",
  },
  {
    id: 8,
    name: "Ringo Starr",
    number: "456-789-0123",
  },
];

// routes
app.get("/", (request, response) => {
  // console.log("[part3]: GET /: welcomming message.");
  response.send("<h1>Hello Part3!</h1>");
});

app.get("/api/persons", (request, response) => {
  // console.log("[part3]: GET /api/persons.");
  response.json(persons);
});

app.get("/info", (request, response) => {
  // console.log("[part3]: GET /info.");
  const totalPersons = persons.length;
  const timestamp = new Date();
  response.send(`
    <p>Phonebook has info for ${totalPersons} people.</p>
    <p>${timestamp}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === Number(id));
  // console.log("[part3]: GET /api/person/:id:", person);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Not Found: custom message.";
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  // console.log("[part3]: DELETE /api/persons/:id:", id);
  response.statusMessage = "Deleted: custom message.";
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // console.log("[part3]: POST /api/persons:", body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing.",
    });
  }
  const existingPerson = persons.find((p) => p.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique.",
    });
  }
  const person = {
    name: body.name,
    number: body.number || "999999999",
    id: Math.floor(Math.random() * 1000000),
    // id: generateId(),
  };
  persons = [...persons, person];
  response.statusMessage = "Posted: custom message";
  response.json(person);
});

// helper functions
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  return String(maxId + 1);
};

// unknown endpoint
app.use(unknownEndpoint);

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`[part3]: Server running on ${process.env.HOST}:${PORT}...`);

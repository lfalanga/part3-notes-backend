require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
var morgan = require("morgan");
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint." });
};

// middleware
// app.use(express.static("build"));
app.use(express.static("dist"));
app.use(express.json());
// using morgan custom token
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
// using cors
app.use(cors());

// database

let notes = [
  {
    id: 1,
    content: "HTML is easy.",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript.",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol.",
    important: true,
  },
  {
    id: 4,
    content: "Learn from your mistakes.",
    important: false,
  },
  {
    id: 5,
    content: "Practice makes perfect.",
    important: true,
  },
  {
    id: 6,
    content: "Persistence is key.",
    important: true,
  },
];

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
// app.get("/", (request, response) => {
//   response.send("<h1>Hello Part3!</h1>");
// });
app.get("/home", (request, response) => {
  response.send("<h1>Part3 Home Page!</h1>");
});

// notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === Number(id));
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Not Found: custom message.";
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);
  console.log("[part3]: DELETE /api/notes/:id:", id);
  response.statusMessage = "Deleted: custom message.";
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing.",
    });
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  notes = [...notes, note];
  response.statusMessage = "Posted: custom message";
  response.json(note);
});

// persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
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
  response.statusMessage = "Deleted: custom message.";
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
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
  };
  persons = [...persons, person];
  response.statusMessage = "Posted: custom message";
  response.json(person);
});

// helper functions
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

// unknown endpoint
app.use(unknownEndpoint);

// server
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`[part3]: Server running on ${process.env.HOST}:${PORT}...`);

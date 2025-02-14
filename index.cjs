require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/", (request, response) => {
  console.log("[part3]: GET /: welcomming message.");
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  console.log("[part3]: GET /api/notes.");
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === Number(id));
  console.log("[part3]: GET /api/notes/:id:", note);
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
  response.statusMessage = "Deleted: custom message";
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log("[part3]: POST /api/notes:", body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing.",
    });
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    // id: Math.floor(Math.random() * 1000000),
    id: generateId(),
  };
  notes = [...notes, note];
  response.statusMessage = "Posted: custom message";
  response.json(note);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`[part3]: Server running on ${process.env.HOST}:${PORT}...`);

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

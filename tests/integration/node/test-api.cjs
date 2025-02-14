const { beforeAll, afterAll, describe, it, expect } = require("@jest/globals");
const { createServer } = require("../../server");
const request = require("supertest");

let server;

console.log("test-api");

beforeAll(async () => {
  server = await createServer();
});

afterAll(async () => {
  await server.close();
});

describe("rest api", () => {
  it("should return notes", async () => {
    await request(server)
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  it("should return a specific note", async () => {
    const response = await request(server)
      .get("/api/notes/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.id).toBe(1);
  });
  it("should return 404 if note is not found", async () => {
    await request(server).get("/api/notes/99999").expect(404);
  });
  it("should create a new note", async () => {
    const newNote = {
      content: "this is a new note",
      important: true,
    };
    const response = await request(server)
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body.content).toBe(newNote.content);
    expect(response.body.important).toBe(newNote.important);
  });
  it("should update a note", async () => {
    const updatedNote = {
      content: "updated note",
      important: false,
    };
    await request(server).put("/api/notes/1").send(updatedNote).expect(200);
  });
  it("should delete a note", async () => {
    await request(server).delete("/api/notes/1").expect(204);
  });
});

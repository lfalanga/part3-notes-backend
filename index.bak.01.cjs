// console.log("[part3]: Hello Wold!");

require("dotenv").config();
// console.log(process.env);
const http = require("http");

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("[part3]: Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`[part3]: Server running on ${process.env.HOST}:${PORT}...`);

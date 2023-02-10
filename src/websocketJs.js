import express from "express";
import http from "http";
import WebSocket from "ws";

//init setting
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
//setting end

//socket database
const sockets = [];

//socket setting
wss.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  console.log("connected");
  sockets.push(socket);
  socket.on("close", () => console.log("Disconnected from Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}:${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, () => console.log("listening on 3000"));

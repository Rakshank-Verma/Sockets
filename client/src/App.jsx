import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  // const socket = io("http://localhost:3000");
  const socket = useMemo(() => {
    return io("http://localhost:3000");
  }, []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [Room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  // console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    // socket.emit("message", message);
    socket.emit("message", { message, Room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-msg", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        Welcome to Socket Tutorial
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlinebasic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlinebasic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={Room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlinebasic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </Stack>
    </Container>
  );
};

export default App;

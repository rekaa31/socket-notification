import "./App.css";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { Button } from "@chakra-ui/react";

function App() {
  const [socket, setSocket] = useState(null);

  // Get from local storage
  const token = localStorage.getItem("token");

  // UseEffect IO
  useEffect(() => {
    if (token) {
      // Decode JWT
      const decoded = jwtDecode(token);
      const { id_user } = decoded;

      const initSocket = io("http://localhost:3000", {
        query: {
          id_user,
        },
      });

      setSocket(initSocket);

      // Listen for connection
      initSocket.on("connect", () => {
        console.log("Connected to the server with socket ID:", initSocket.id);
      });

      // Listen for disconnection
      initSocket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });

      // Cleanup
      return () => {
        initSocket.disconnect();
      };

    }
  }, [token]);

  const handleTestEmit = () => {

    const decoded = jwtDecode(token);
    const { id_user } = decoded;

    socket.emit("new-notification", {
      message: "Hello, this is a test notification",
      recipientId: id_user
    });
  }

  return (
    <>
      {token ? (
        <>
          <Navbar socket={socket}/>
          <h1>Welcome to the Dashboard</h1>
          <Button
            colorScheme="teal"
            onClick={handleTestEmit}
          >
            Test Emit
          </Button>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export default App;

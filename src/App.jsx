import React, { useState } from "react";
import Chat from "./components/Chat";

const App = () => {
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [ws, setWs] = useState(null);

  const handleClick = () => {
    if(userName){
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "register", userName: userName }));
      setWs(ws);
      setJoined(true);
    }
  }
}

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {!joined ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Join Chat
          </h1>
          <label className="block text-sm font-medium text-gray-700">
            Enter your name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <button
            onClick={handleClick}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Join
          </button>
        </div>
      ) : (
        <Chat userName={userName} ws={ws} />
      )}
    </div>
  );
};

export default App;

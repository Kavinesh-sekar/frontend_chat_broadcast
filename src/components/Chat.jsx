import React, { useEffect, useState ,useRef} from "react";

const Chat = ({ userName, ws }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [notification, setNotification] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      if (data.type === "message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { name: data.userName, text: data.content, isMine: data.userName === userName },
        ]);
      } else if (data.type === "system") {
        setNotification(data.content);
        setTimeout(() => setNotification(null), 3000);

        setMessages((prevMessages) => [
          ...prevMessages,
          { name: "System", text: data.content, isMine: false },
        ]);
      } else if (data.type === "online-users") {
        setOnlineUsers(data.users); 
      }
    };

   

    return () => {
      ws.onmessage = null;
    };
  }, [ws, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() !== "") {
      ws.send(JSON.stringify({ type: "message", userName, content: text }));
      setText("");
    }
  };

  return (
    <div className="flex w-1/2">
      {/* Chat Section */}
      <div className="flex flex-col w-3/4 h-screen bg-gray-100  border-l">
        <div className="bg-blue-600 text-white text-center py-4 font-semibold">
          Welcome, {userName}!
        </div>

        {notification && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            {notification}
          </div>
        )}

        <div className="flex-1 p-4 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isMine ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.isMine ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                <span className="block text-xs text-gray-700">{msg.isMine ? "You" : msg.name}</span>
                {msg.text}
              </div>
            </div>
          ))}
           <div ref={messagesEndRef}></div>
        </div>
       

        <div className="p-4 bg-white border-t flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="w-1/4 bg-white p-4 border-l">
        <h2 className="text-lg font-semibold">Online Users</h2>
        <ul>
          {onlineUsers.map((user, index) => (
            // <li key={index} className=" rounded-full antialiased animate-pulse text-green-600 text-lg ">
            //   {user}
            // </li>

            <li 
            key={index} 
            className="flex items-center gap-5 p-2  rounded-lg shadow-sm hover:bg-gray-200 transition space"
          >
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-700 font-medium text-lg">{user}</span>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;

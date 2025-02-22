 Chat App Frontend 

1. WebSocket Connection

      Establishes a real-time connection between client and server.
      
      Sends and receives messages instantly.
      
      const ws = new WebSocket("ws://localhost:5000");
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "register", userName }));
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received: ", data);
      };

2. React Hooks

        useState: Manages component states (e.g., user input, connection status, messages).
        
        useEffect: Handles side effects like listening for WebSocket messages.
        
        const [messages, setMessages] = useState([]);
        useEffect(() => {
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
          };
          return () => {
            ws.onclose = () => console.log("WebSocket closed");
          };
        }, []);

3. User Interaction

        User enters a name and clicks "Join" to connect.
        
        Messages are sent and received dynamically.
        
        Online users list updates in real-time.
        
        const sendMessage = () => {
          if (text.trim()) {
            ws.send(JSON.stringify({ type: "message", userName, content: text }));
            setText("");
          }
        };




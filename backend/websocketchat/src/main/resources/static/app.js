let stompClient;

// Add event listeners for buttons
document.getElementById("connectButton").addEventListener("click", connect);
document
  .getElementById("sendMessageButton")
  .addEventListener("click", sendMatchRequest);

// Function to connect to the WebSocket server
function connect() {
  const socket = new SockJS("/matching-websocket"); // Connect to the WebSocket endpoint
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    (frame) => {
      // Connection successful
      console.log("Connected: " + frame); // Add print statement for connection success
      alert("WebSocket connection established"); // Optional alert to notify success in UI

      // Subscribe to the user-specific queue for receiving match notifications
      stompClient.subscribe("/user/queue/matches", (message) => {
        console.log("Received a message from the server: ", message.body); // Add print statement for received messages
        document.getElementById(
          "messages"
        ).innerHTML += `<p>Received: ${message.body}</p>`;
      });
    },
    (error) => {
      // Connection error handling
      console.error("WebSocket connection failed: " + error); // Print error if connection fails
      alert("WebSocket connection failed. Check console for details."); // Notify user of connection failure
    }
  );
}

// Function to send a test match request through WebSocket
function sendMatchRequest() {
  // Create a hardcoded test match request object
  const matchRequest = JSON.stringify({
    userEmail: "testuser@example.com",
    topics: ["test_topic_1"],
    programmingLanguages: ["Java"],
    difficulties: ["medium"],
  });

  // Check if stompClient is connected before sending
  if (stompClient && stompClient.connected) {
    // Send the test match request through the WebSocket
    stompClient.send("/app/matchRequest", {}, matchRequest);
    console.log("Test match request sent: ", matchRequest); // Add print statement for sent match request
    alert("Match request sent successfully"); // Notify the user
  } else {
    console.error("Cannot send match request: WebSocket is not connected");
    alert("Cannot send match request: WebSocket is not connected"); // Notify user of connection issue
  }
}

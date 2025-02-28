const express = require("express");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json()); // Parse JSON request body

// Step 1: Run the backend setup script to deploy the agent
app.post("/deploy-agent", (req, res) => {
  console.log("🛠 Running setup to deploy the agent...");
  
  // Run the Bash script to deploy the agent
  exec("./pages/nearai.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ exec error: ${error.message}`);
      return res.status(500).json({ message: "Error deploying the agent." });
    }

    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
      return res.status(500).json({ message: "Error in the agent deployment script." });
    }

    console.log(`✅ Agent Deployment Output: ${stdout}`);
    res.status(200).json({ message: "Agent deployed successfully!" });
  });
});

// Step 2: Handle user messages and send them to the agent
app.post("/message", (req, res) => {
  const userMessage = req.body.message;
  
  // Send the message to the deployed agent for processing (assuming you have the mechanism set up to interact with the AI agent)
  console.log(`🧠 Sending message to the AI agent: ${userMessage}`);
  
  // Simulate agent response (replace with actual interaction with the agent)
  const agentResponse = `AI Response to: ${userMessage}`;
  
  res.status(200).json({ botResponse: agentResponse });
});

app.use(express.json()); // Middleware to parse JSON request body

// Path to the shell script
const scriptPath = "/Users/vikrampidaparthi/Documents/BAF/NFTeez/pages/nearai.sh"; // Update with the correct path to your shell script
const { spawn } = require("child_process");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);

  // Use spawn instead of exec
  const process = spawn("bash", [scriptPath]);

  process.stdout.on("data", (data) => {
    console.log(`✅ Script Output: ${data.toString()}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`⚠️ Script Error: ${data.toString()}`);
  });

  process.on("close", (code) => {
    console.log(`🔚 Script process exited with code ${code}`);
  });

  process.on("error", (err) => {
    console.error(`❌ Script execution failed: ${err.message}`);
  });
});
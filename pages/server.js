const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = 5001;

// Middleware to parse JSON body
app.use(express.json());

// Route to handle the request and run the Bash script
app.post("/run-bash", (req, res) => {
  const { message } = req.body;

  // If the message contains a trigger, run the bash script
  if (message.toLowerCase().includes("top collection") || message.toLowerCase().includes("top feature")) {
    // Run the Bash script (make sure the script is executable and correctly set up)
    exec("./pages/nearai.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("Error running the script");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send("Error in script execution");
      }

      // Send the script's output as the bot's response
      res.json({ botResponse: stdout });
    });
  } else {
    // Default bot response
    res.json({ botResponse: "I'm not sure how to answer that." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import { spawn } from 'child_process';

export default function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message.toLowerCase().includes("start setup")) {
      // Start the script using spawn
      const process = spawn('bash', ['./pages/nearai.sh']);

      let stdoutData = '';
      let stderrData = '';

      // Capture stdout (standard output) data
      process.stdout.on('data', (data) => {
        stdoutData += data.toString();
        console.log(`stdout: ${data.toString()}`);  // Log stdout in real-time
      });

      // Capture stderr (standard error) data
      process.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`stderr: ${data.toString()}`);  // Log any errors
      });

      // Listen for when the process closes (exit event)
      process.on('close', (code) => {
        console.log(`Process exited with code ${code}`);

        // Handle any errors
        if (code !== 0) {
          return res.status(500).json({
            error: `Process failed with code ${code}. stderr: ${stderrData}`,
          });
        }

        // Now you should have the full output including the auth link if it was printed
        console.log('Final stdout:', stdoutData);

        // You can use a regex to match the authentication link
        const authLink = stdoutData.match(/Please visit the following URL to complete the login process: (https:\/\/auth\.near\.ai[^\s]+)/);
        
        if (authLink) {
          return res.status(200).json({
            botResponse: "Please authenticate by clicking the link below:",
            authLink: authLink[1],  // The authentication link
          });
        } else {
          return res.status(200).json({
            botResponse: "I couldn't find the authentication link, please check the script output.",
            output: stdoutData,
          });
        }
      });

      // Immediately send the response indicating the process has started
      res.status(200).json({ botResponse: "The setup has started, please authenticate." });
    } else {
      res.status(200).json({ botResponse: "I'm not sure how to answer that." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

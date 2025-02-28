import asyncio
import websockets
import subprocess


# asyncio needed 
chatbot_process = subprocess.Popen(
    ["bash", "./nearai.sh"],  # Runs nearai.sh manually
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    bufsize=1  # Idk wwhy this needed but it is
)

async def read_chatbot_output(websocket):
    """Read the output from the chatbot process and send it to the frontend."""
    while True:
        try:
            bot_response = chatbot_process.stdout.readline().strip()  # Read output line-by-line
            if bot_response:
                print(f"🤖 Chatbot Response: {bot_response}")
                await websocket.send(bot_response)  # Send the response to the frontend

        except Exception as e:
            print(f"Error reading output: {e}")
            break

async def handle_client(websocket, *args, **kwargs):
    """Handle the WebSocket connection and send user input to the chatbot."""
     
    asyncio.create_task(read_chatbot_output(websocket))
    print("HIIIIII")
    while True:
        try:
            # Wait for message from React frontend
            user_message = await websocket.recv()
            
            print(f" Received from React: {user_message}")

            # Send user input to the nearai.sh process
            chatbot_process.stdin.write(user_message + "\n") 
            chatbot_process.stdin.flush()  # Ensure input is flushed immediately

        except Exception as e:
            print(f"Error: {e}")
            break

# Start WebSocket server
async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("✅ WebSocket server started on ws://localhost:8765")
    await server.wait_closed()

# Run the event loop
if __name__ == "__main__":
    asyncio.run(start_server())  # Start the WebSocket server in the asyncio event loop
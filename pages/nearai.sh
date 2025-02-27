#!/bin/bash

echo "🚀 Starting NEAR AI Setup..."

# Step 1: Set up a virtual environment
echo "🔧 Setting up Python virtual environment..."
cd ~
python3.11 -m venv nearai-env
source nearai-env/bin/activate

# Step 2: Confirm virtual environment is active
echo "🧐 Checking Python version..."
which_python=$(which python3)
expected_python="$HOME/nearai-env/bin/python3"

if [[ "$which_python" == "$expected_python" ]]; then
    echo "✅ Virtual environment is active: $which_python"
else
    echo "❌ Virtual environment not set correctly. Exiting."
    exit 1
fi

# Step 3: Install NEAR AI CLI
echo "📦 Installing NEAR AI CLI..."
pip install --upgrade pip setuptools
pip install nearai

# Step 4: Verify NEAR AI installation
echo "🔍 Verifying NEAR AI installation..."
nearai_version=$(python3 -m nearai version 2>/dev/null)

if [[ "$nearai_version" == "0.1.13" ]]; then
    echo "✅ NEAR AI installed successfully! Version: $nearai_version"
else
    echo "❌ NEAR AI installation failed. Exiting."
    exit 1
fi

# Step 5: Connecting NEAR Wallet
echo "🔑 Logging into NEAR Wallet..."
nearai login
echo "⚠️ Please complete wallet authentication in the browser."

# Step 6: Create an AI Agent
echo "🤖 Creating NEAR AI Agent..."
agent_name="my_first_agent"
agent_creation_output=$(nearai agent create --name "$agent_name")

echo $agent_creation_output
# Step 7: Parse the agent path from the output using a regular expression
# This regex will capture the full path starting from '/Users/...'
agent_path=$(echo "$agent_creation_output" | awk -F'New AI Agent created at: ' '{print $2}' | tr -d '[:space:]')

# Debugging: Print the agent path
echo "Detected Agent Path: $agent_path"

# Check if the agent path exists
if [ -d "$agent_path" ]; then
    echo "📂 AI Agent created at: $agent_path"
    cd "$agent_path"
else
    echo "❌ Failed to create AI Agent. Directory not found: $agent_path"
    exit 1
fi

# # Step 8: List agent files
# echo "📄 Listing agent files..."
# ls -la

# # Step 9: Open agent.py for editing
# echo "📝 Opening agent.py for editing..."
# nano agent.py

# Step 10: Run the AI Agent interactively
echo "🚀 Starting interactive session with your AI agent..."
nearai agent interactive "$agent_path" --local

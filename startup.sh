#!/bin/bash

echo "🔧 Checking FFmpeg..."

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 FFmpeg not found. Installing..."
    apt-get update
    apt-get install -y ffmpeg
    echo "✅ FFmpeg installed!"
else
    echo "✅ FFmpeg already installed."
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if [[ -f /home/container/${REQUIREMENTS_FILE} ]]; then
    pip install -U --prefix .local -r ${REQUIREMENTS_FILE}
fi

# Start the bot
echo "🚀 Starting bot..."
/usr/local/bin/python /home/container/main.py
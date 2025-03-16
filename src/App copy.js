import React, { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [isRecording, setIsRecording] = useState(false); // Track recording state
  const [audioBlob, setAudioBlob] = useState(null); // Store recorded audio
  const mediaRecorderRef = useRef(null); // Reference to MediaRecorder instance
  const audioChunksRef = useRef([]); // Store audio chunks

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true, // Explicitly request audio
        video: true, // Video is required for getDisplayMedia
      });

      // Proceed with recording logic
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop recording
      setIsRecording(false); // Update recording state
    }
  };

  // Save recording
  const saveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav"; // Set the file name
      a.click(); // Trigger download
      URL.revokeObjectURL(url); // Clean up
    }
  };

  return (
    <div className="App">
      <h1>Audio Recorder</h1>
      <div className="controls">
        {/* Start Recording Button */}
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>

        {/* Stop Recording Button */}
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>

        {/* Save Recording Button */}
        <button onClick={saveRecording} disabled={!audioBlob}>
          Save Recording
        </button>
      </div>

      {/* Display Recording Status */}
      <p>Recording Status: {isRecording ? "ON 🟢" : "OFF 🔴"}</p>

      {/* Audio Player */}
      {audioBlob && (
        <div className="audio-player">
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}
    </div>
  );
};

export default App;
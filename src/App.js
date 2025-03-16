import React, { useState, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SaveIcon from "@mui/icons-material/Save";

const theme = createTheme({
    palette: {
        mode: "dark", 
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1", 
        },
    },
});

const App = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true,
            });
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
            alert("Failed to start recording. Please allow access to screen and audio.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const saveRecording = () => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recording.wav";
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: 2,
                    backgroundColor: "background.default",
                }}
            >
                <Card sx={{ minWidth: 300, textAlign: "center" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Audio Recorder
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Recording Status: {isRecording ? "ON 🟢" : "OFF 🔴"}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<MicIcon />}
                                onClick={startRecording}
                                disabled={isRecording}
                            >
                                Start
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<StopIcon />}
                                onClick={stopRecording}
                                disabled={!isRecording}
                            >
                                Stop
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<SaveIcon />}
                                onClick={saveRecording}
                                disabled={!audioBlob}
                            >
                                Save
                            </Button>
                        </Box>
                        {audioBlob && (
                            <Box sx={{ mt: 2 }}>
                                <audio controls src={URL.createObjectURL(audioBlob)} />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default App;
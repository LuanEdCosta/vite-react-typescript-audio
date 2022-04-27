import { useState } from "react";
import { FiPlay } from "react-icons/fi";

import "./App.css";

export const App: React.FC = () => {
  const [audioSource, setAudioSource] = useState<string>();

  const handleStartRecordingAudio = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.start();

      const chunks: Blob[] = [];

      mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);
        const audio = URL.createObjectURL(blob);
        setAudioSource(audio);
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    } catch (e) {
      const error = e as Error;
      console.log(error.message);
    }
  };

  return (
    <div className="h-screen py-8 px-4 bg-gray-900 text-white transition-colors">
      <div className="max-w-xl m-auto">
        <div className="text-2xl font-black text-center mb-8 border-b pb-4 border-gray-700">
          Vite React TypeScript Audio
        </div>

        <button
          className="h-12 w-full text-center bg-cyan-500 rounded-sm font-bold flex items-center justify-center transition-colors hover:bg-cyan-600 m-auto"
          onClick={handleStartRecordingAudio}
        >
          <span className="mr-2">Record Audio</span>
          <FiPlay />
        </button>

        {audioSource && (
          <audio className="mt-8" controls>
            <source src={audioSource} type="audio/mpeg"></source>
          </audio>
        )}
      </div>
    </div>
  );
};

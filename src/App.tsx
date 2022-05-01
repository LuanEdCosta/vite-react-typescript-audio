import { FiDownload, FiPause, FiPlay, FiSquare, FiTrash } from "react-icons/fi";

import { useRecordAudio } from "./useRecordAudio";

import "./App.css";

export const App: React.FC = () => {
  const {
    error,
    audioPreview,
    recorderState,
    cannotStartRecording,
    handleStopRecording,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleDiscardRecording,
    handleClearChunksAndPreview,
  } = useRecordAudio();

  return (
    <div className="h-screen py-8 px-4 bg-gray-900 text-white transition-colors">
      <div className="max-w-xl m-auto space-y-8">
        <div className="text-2xl font-black text-center border-b pb-4 border-gray-700">
          Vite React TypeScript Audio
        </div>

        <button
          style={{
            opacity: cannotStartRecording ? 0.5 : 1,
            pointerEvents: cannotStartRecording ? "none" : "all",
          }}
          className="h-12 w-full text-center bg-cyan-500 rounded-sm font-bold flex items-center justify-center transition-colors hover:bg-cyan-600 m-auto"
          onClick={handleStartRecording}
        >
          <span className="mr-2">Record Audio</span>
          <FiPlay />
        </button>

        {(recorderState === "recording" || recorderState === "paused") && (
          <div className="space-x-4 flex items-center justify-center">
            <button
              className="h-12 w-12 bg-cyan-500 transition-colors hover:bg-cyan-600 flex items-center justify-center rounded-full"
              onClick={
                recorderState === "recording"
                  ? handlePauseRecording
                  : handleResumeRecording
              }
            >
              {recorderState === "recording" ? <FiPause /> : <FiPlay />}
            </button>

            <button
              className="h-12 w-12 bg-green-500 transition-colors hover:bg-green-600 flex items-center justify-center rounded-full"
              onClick={handleStopRecording}
            >
              <FiSquare />
            </button>

            <button
              className="h-12 w-12 bg-red-500 transition-colors hover:bg-red-600 flex items-center justify-center rounded-full"
              onClick={handleDiscardRecording}
            >
              <FiTrash />
            </button>
          </div>
        )}

        {error && <div>{error.message}</div>}

        {audioPreview && (
          <div className="space-x-4 flex items-center">
            <audio controls controlsList="nodownload">
              <source src={audioPreview} type="audio/mpeg"></source>
            </audio>

            <a
              className="h-8 w-8 bg-blue-500 transition-colors hover:bg-blue-600 flex items-center justify-center rounded-full"
              download={`Audio-${Date.now()}.mp3`}
              href={audioPreview}
            >
              <FiDownload />
            </a>

            <button
              className="h-8 w-8 bg-red-500 transition-colors hover:bg-red-600 flex items-center justify-center rounded-full"
              onClick={handleClearChunksAndPreview}
            >
              <FiTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

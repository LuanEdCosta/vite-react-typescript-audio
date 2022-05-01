import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RecorderState = "inactive" | "paused" | "recording";

export type UseRecordAudioOptions = {
  mediaRecorderOptions?: MediaRecorderOptions;
};

export const USE_RECORD_AUDIO_DEFAULT_OPTIONS: UseRecordAudioOptions = {};

export const useRecordAudio = (
  options: UseRecordAudioOptions = USE_RECORD_AUDIO_DEFAULT_OPTIONS
) => {
  const chunks = useRef<Blob[]>([]);
  const recorder = useRef<MediaRecorder>();
  const discard = useRef<boolean>(false);

  const [error, setError] = useState<Error>();
  const [audioPreview, setAudioPreview] = useState<string>();
  const [isCreatingRecorder, setIsCreatingRecorder] = useState(true);
  const [recorderState, setRecorderState] = useState<RecorderState>("inactive");

  const cannotStartRecording = useMemo(() => {
    return isCreatingRecorder || recorderState !== "inactive";
  }, [isCreatingRecorder, recorderState]);

  const handleCreateStream = useCallback(async () => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  }, []);

  const handleAddChunk = useCallback(({ data }: BlobEvent) => {
    chunks.current.push(data);
  }, []);

  const handleStopAndSetAudioPreview = useCallback(() => {
    if (discard.current) {
      discard.current = false;
      return;
    }

    const blob = new Blob(chunks.current);
    const audioUrl = URL.createObjectURL(blob);
    setAudioPreview(audioUrl);
  }, []);

  const handleErrorsWhileRecording = useCallback(
    (e: MediaRecorderErrorEvent) => {
      setError(e.error);
      chunks.current = [];
    },
    []
  );

  const handleSetupEventListeners = useCallback(() => {
    recorder.current?.addEventListener("dataavailable", handleAddChunk);
    recorder.current?.addEventListener("error", handleErrorsWhileRecording);
    recorder.current?.addEventListener("stop", handleStopAndSetAudioPreview);
  }, [
    handleAddChunk,
    handleErrorsWhileRecording,
    handleStopAndSetAudioPreview,
  ]);

  const handleRemoveEventListeners = useCallback(() => {
    recorder.current?.removeEventListener("dataavailable", handleAddChunk);
    recorder.current?.removeEventListener("error", handleErrorsWhileRecording);
    recorder.current?.removeEventListener("stop", handleStopAndSetAudioPreview);
  }, [
    handleAddChunk,
    handleErrorsWhileRecording,
    handleStopAndSetAudioPreview,
  ]);

  const handleCreateRecorder = useCallback(async () => {
    try {
      const stream = await handleCreateStream();
      recorder.current = new MediaRecorder(
        stream,
        options.mediaRecorderOptions
      );
      handleSetupEventListeners();
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsCreatingRecorder(false);
    }
  }, [handleCreateStream, handleSetupEventListeners]);

  const handleClearChunksAndPreview = useCallback(() => {
    chunks.current = [];
    setAudioPreview("");
  }, []);

  const handleStartRecording = useCallback(() => {
    handleClearChunksAndPreview();
    recorder.current?.start();
    setRecorderState("recording");
  }, [handleClearChunksAndPreview]);

  const handlePauseRecording = useCallback(() => {
    recorder.current?.pause();
    setRecorderState("paused");
  }, []);

  const handleStopRecording = useCallback(() => {
    recorder.current?.stop();
    setRecorderState("inactive");
  }, []);

  const handleResumeRecording = useCallback(() => {
    recorder.current?.resume();
    setRecorderState("recording");
  }, []);

  const handleDiscardRecording = useCallback(() => {
    discard.current = true;
    recorder.current?.stop();
    handleClearChunksAndPreview();
    setRecorderState("inactive");
  }, [handleClearChunksAndPreview]);

  useEffect(() => {
    handleCreateRecorder();
    return () => handleRemoveEventListeners();
  }, [handleCreateRecorder, handleRemoveEventListeners]);

  return {
    error,
    chunks,
    recorder,
    audioPreview,
    recorderState,
    isCreatingRecorder,
    cannotStartRecording,
    handleStopRecording,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleDiscardRecording,
    handleClearChunksAndPreview,
  };
};

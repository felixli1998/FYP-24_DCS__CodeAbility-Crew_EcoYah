import { useState, useEffect } from "react";

type TextToSpeechType = {
  text: string;
  play: boolean;
}

export default function TextToSpeech(props: TextToSpeechType) {
    const { text, play } = props;
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState<any>(null);
  
    useEffect(() => {
      const synth = window.speechSynthesis;
      const utterance: any = new SpeechSynthesisUtterance(text);
  
      setUtterance(utterance);
  
      return () => {
        synth.cancel();
      };
    }, [text]);

    const handlePlay = () => {
      const synth = window.speechSynthesis;

      synth.speak(utterance);
  
      setIsPaused(false);
    };
  
    const handlePause = () => {
      const synth = window.speechSynthesis;
  
      synth.pause();
  
      setIsPaused(true);
    };
  
    const handleStop = () => {
      const synth = window.speechSynthesis;
  
      synth.cancel();
  
      setIsPaused(false);
    };
  
    return (
      <div>
        <button onClick={handlePlay}>
          {isPaused ? "Resume" : "Play"}
        </button>
        {/* <button onClick={handlePause}>Pause</button>
        <button onClick={handleStop}>Stop</button> */}
      </div>
    );
  }
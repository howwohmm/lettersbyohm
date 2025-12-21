import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from './AudioProvider';

const AudioToggle = () => {
  const { isPlaying, toggleAudio } = useAudio();

  return (
    <button
      onClick={toggleAudio}
      className="p-2 text-foreground/60 hover:text-foreground transition-colors"
      aria-label={isPlaying ? 'Mute audio' : 'Unmute audio'}
    >
      {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
};

export default AudioToggle;

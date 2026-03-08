import { useState } from 'react';
import { Volume2, VolumeX, Music, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  muted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  toggleMute: () => void;
  setMasterVolume: (v: number) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  playChime: () => void;
}

const AudioControls = ({
  muted, masterVolume, musicVolume, sfxVolume,
  toggleMute, setMasterVolume, setMusicVolume, setSfxVolume, playChime,
}: AudioControlsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        className="relative"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        title="Audio Settings"
      >
        <Music className="h-4 w-4" />
        <ChevronDown className={`h-3 w-3 ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-56 rounded-lg border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-display text-primary mb-1">
              <span>Audio Settings</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={playChime}>
                <Sparkles className="h-3 w-3 mr-1" /> Test
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex justify-between">
                <span>Master</span>
                <span>{Math.round(masterVolume * 100)}%</span>
              </label>
              <Slider
                value={[masterVolume * 100]}
                onValueChange={([v]) => setMasterVolume(v / 100)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex justify-between">
                <span>🎵 Music</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </label>
              <Slider
                value={[musicVolume * 100]}
                onValueChange={([v]) => setMusicVolume(v / 100)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex justify-between">
                <span>✨ SFX</span>
                <span>{Math.round(sfxVolume * 100)}%</span>
              </label>
              <Slider
                value={[sfxVolume * 100]}
                onValueChange={([v]) => setSfxVolume(v / 100)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioControls;

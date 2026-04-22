import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  accent: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'AI Synth Ensemble',
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1ecd.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop',
    accent: '#00f3ff'
  },
  {
    id: '2',
    title: 'Digital Pulse',
    artist: 'Cyber Systems',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_b2089b09f4.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop',
    accent: '#ff00ff'
  },
  {
    id: '3',
    title: 'Retro Grid',
    artist: 'Nostalgia Protocol',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_8231267809.mp3',
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&h=400&auto=format&fit=crop',
    accent: '#39ff14'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100 || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm bg-dark-surface/80 border border-white/5 rounded-3xl p-6 backdrop-blur-2xl neon-border overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      {/* Album Art Section */}
      <div className="relative aspect-square mb-8 rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ scale: 1.1, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotate: 5 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* State Indicators */}
        <div className="absolute bottom-4 left-4 flex gap-2">
           <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-neon-lime animate-pulse' : 'bg-white/20'}`} />
           <div className="w-2 h-2 rounded-full bg-white/20" />
           <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        
        {/* Animated Disc for Playing state */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Disc className="text-white/20" size={48} />
          </motion.div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mb-8">
        <motion.h3 
          key={`title-${currentTrack.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold tracking-tight text-white mb-1"
        >
          {currentTrack.title}
        </motion.h3>
        <motion.p 
          key={`artist-${currentTrack.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-mono text-white/40 uppercase tracking-widest"
        >
          {currentTrack.artist}
        </motion.p>
      </div>

      {/* Scrub Bar */}
      <div className="mb-8 group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan active:accent-neon-magenta transition-all"
        />
        <div className="flex justify-between mt-2 font-mono text-[10px] text-white/30 tracking-wider">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "00:00"}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={prevTrack}
          className="p-3 text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>
        
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? (
            <Pause size={30} fill="currentColor" />
          ) : (
            <Play size={30} className="ml-1" fill="currentColor" />
          )}
        </button>

        <button 
          onClick={nextTrack}
          className="p-3 text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Music size={12} />
          <span>44.1 KHZ / 24-BIT</span>
        </div>
        <Volume2 size={14} />
      </div>
    </div>
  );
}

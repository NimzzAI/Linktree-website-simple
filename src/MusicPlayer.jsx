import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Disc3, RotateCcw, ChevronUp, ChevronDown, Music2 } from 'lucide-react';
import { settings } from './settings.js';

const MusicPlayer = ({ onToast }) => {
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    onToast?.(`Now playing: ${settings.music.title}`);
                })
                .catch(() => {
                    setIsPlaying(false);
                    onToast?.("Tap play again to enable audio");
                });
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        if (!progressRef.current || !audioRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newTime = (clickX / rect.width) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleLoop = () => {
        const nextLoop = !isLooping;
        setIsLooping(nextLoop);
        if (audioRef.current) {
            audioRef.current.loop = nextLoop;
        }
        onToast?.(nextLoop ? "Repeat track enabled" : "Repeat track disabled");
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <>
            <motion.div 
                className="music-floating-dock"
                id="music-floating-dock"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <button 
                    className={`dock-chip ${isPlaying ? 'dock-chip-active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    id="music-dock-toggle"
                    aria-label="Toggle music player"
                >
                    <div className="dock-avatar-spin">
                        <img 
                            src={settings.music.cover} 
                            alt="Cover" 
                            className={`dock-cover ${isPlaying ? 'spin' : ''}`}
                        />
                        {isPlaying && <span className="dock-live-dot" />}
                    </div>

                    <div className="dock-meta">
                        <span className="dock-title">{settings.music.title}</span>
                        <span className="dock-artist">{settings.music.artist}</span>
                    </div>

                    <div className="dock-waveform">
                        {[40, 75, 55, 90, 45].map((h, i) => (
                            <span 
                                key={i} 
                                className={`dock-bar ${isPlaying ? 'dock-bar-animated' : ''}`}
                                style={{ 
                                    height: isPlaying ? `${h}%` : '20%',
                                    animationDelay: `${i * 0.15}s` 
                                }}
                            />
                        ))}
                    </div>

                    <div 
                        className="dock-quick-play"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </div>

                    <div className="dock-chevron">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                </button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="music-expanded-panel glass-card"
                        id="music-expanded-panel"
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                        <div className="music-expanded-header">
                            <div className="music-album-art">
                                <img 
                                    src={settings.music.cover} 
                                    alt="Album cover" 
                                    className={`expanded-cover ${isPlaying ? 'spin-slow' : ''}`}
                                />
                                <div className="expanded-disc-center">
                                    <Disc3 size={20} className={isPlaying ? 'spin' : ''} />
                                </div>
                            </div>
                            
                            <div className="expanded-details">
                                <div className="expanded-badge">
                                    <Music2 size={12} />
                                    <span>Audio Player</span>
                                </div>
                                <h4 className="expanded-title">{settings.music.title}</h4>
                                <p className="expanded-artist">{settings.music.artist}</p>
                            </div>
                        </div>

                        <div className="expanded-visualizer">
                            {[18, 35, 60, 85, 45, 95, 70, 30, 80, 50, 90, 65, 40, 75, 30].map((bar, index) => (
                                <div 
                                    key={index}
                                    className={`expanded-wave-bar ${isPlaying ? 'active' : ''}`}
                                    style={{ 
                                        animationDelay: `${(index % 6) * 0.12}s`,
                                        height: isPlaying ? undefined : '15%'
                                    }}
                                />
                            ))}
                        </div>

                        <div className="expanded-progress-section">
                            <div 
                                className="scrubber-bar"
                                ref={progressRef}
                                onClick={handleSeek}
                                id="music-scrubber"
                            >
                                <div 
                                    className="scrubber-fill"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <span className="scrubber-handle" />
                                </div>
                            </div>
                            <div className="scrubber-timestamps">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="expanded-controls">
                            <button 
                                className={`icon-control-btn ${isLooping ? 'active' : ''}`}
                                onClick={toggleLoop}
                                id="music-loop-btn"
                                aria-label="Toggle loop"
                            >
                                <RotateCcw size={15} />
                            </button>

                            <button 
                                className="main-play-toggle"
                                onClick={togglePlay}
                                id="music-main-play-btn"
                                aria-label={isPlaying ? "Pause music" : "Play music"}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                            </button>

                            <div className="volume-control-group">
                                <button 
                                    className="icon-control-btn"
                                    onClick={toggleMute}
                                    id="music-volume-mute-btn"
                                    aria-label="Toggle mute"
                                >
                                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setVolume(val);
                                        if (isMuted && val > 0) setIsMuted(false);
                                    }}
                                    className="volume-slider"
                                    id="music-volume-slider"
                                    aria-label="Volume slider"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <audio 
                ref={audioRef}
                src={settings.music.audio}
                loop={isLooping}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    if (!isLooping) setIsPlaying(false);
                }}
            />
        </>
    );
};

export default MusicPlayer;

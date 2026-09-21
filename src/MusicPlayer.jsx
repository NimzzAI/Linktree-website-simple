import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, 
    Pause, 
    SkipBack, 
    SkipForward, 
    RotateCcw, 
    Volume1, 
    Volume2, 
    VolumeX, 
    Airplay, 
    Heart, 
    ChevronDown, 
    Music2
} from 'lucide-react';
import { settings } from './settings.js';

const playHapticFeedback = (enabled = true) => {
    if (!enabled || typeof window === 'undefined') return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.025);
    } catch (e) {}
};

const MusicPlayer = ({ onToast, soundEnabled = true }) => {
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.85);
    const [isMuted, setIsMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const triggerHaptic = () => playHapticFeedback(soundEnabled);

    const togglePlay = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        triggerHaptic();
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    onToast?.(`Playing: ${settings.music.title}`);
                })
                .catch(() => {
                    setIsPlaying(false);
                    onToast?.("Tap play to begin audio");
                });
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && !isScrubbing) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const applySeek = (clientX) => {
        if (!progressRef.current || !audioRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newTime = (clickX / rect.width) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSeekClick = (e) => {
        triggerHaptic();
        applySeek(e.clientX);
    };

    const skipSeconds = (seconds) => {
        triggerHaptic();
        if (!audioRef.current || !duration) return;
        const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
        audioRef.current.currentTime = target;
        setCurrentTime(target);
        onToast?.(seconds > 0 ? "+10s" : "-10s");
    };

    const toggleMute = () => {
        triggerHaptic();
        setIsMuted(!isMuted);
    };

    const toggleLoop = () => {
        triggerHaptic();
        const next = !isLooping;
        setIsLooping(next);
        if (audioRef.current) {
            audioRef.current.loop = next;
        }
        onToast?.(next ? "Repeat: On" : "Repeat: Off");
    };

    const toggleLiked = () => {
        triggerHaptic();
        const next = !isLiked;
        setIsLiked(next);
        onToast?.(next ? "Added to Favorites" : "Removed from Favorites");
    };

    const formatTime = (time, isRemaining = false) => {
        if (!time || isNaN(time) || time < 0) return isRemaining ? "-0:00" : "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        const formatted = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        return isRemaining ? `-${formatted}` : formatted;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const remainingTime = duration > currentTime ? duration - currentTime : 0;

    return (
        <>
            {/* Collapsed Mode: iPhone Dynamic Island Pill */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div 
                        className="ios-pill-dock"
                        id="ios-pill-dock"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div 
                            className="ios-island-capsule"
                            onClick={() => {
                                triggerHaptic();
                                setIsOpen(true);
                            }}
                            id="ios-island-capsule"
                            role="button"
                            tabIndex={0}
                            aria-label="Open iPhone Music Player"
                        >
                            {/* Left: Album artwork with subtle playing indicator */}
                            <div className="ios-capsule-art">
                                <img 
                                    src={settings.music.cover} 
                                    alt={settings.music.title} 
                                    className={`ios-capsule-cover ${isPlaying ? 'playing' : ''}`}
                                />
                                {isPlaying && <span className="ios-live-dot" />}
                            </div>

                            {/* Center: Track title & Artist in iOS typography */}
                            <div className="ios-capsule-meta">
                                <span className="ios-capsule-title">{settings.music.title}</span>
                                <span className="ios-capsule-artist">{settings.music.artist}</span>
                            </div>

                            {/* Right: iOS Soundwave Bars */}
                            <div className="ios-capsule-soundwave" aria-hidden="true">
                                {[45, 85, 60, 95, 50].map((barHeight, idx) => (
                                    <span 
                                        key={idx} 
                                        className={`ios-wave-bar ${isPlaying ? 'animated' : ''}`}
                                        style={{
                                            height: isPlaying ? `${barHeight}%` : '24%',
                                            animationDelay: `${idx * 0.12}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Quick Play/Pause circle button */}
                            <button 
                                className="ios-capsule-play-btn"
                                onClick={togglePlay}
                                id="ios-capsule-play-btn"
                                aria-label={isPlaying ? "Pause music" : "Play music"}
                            >
                                {isPlaying ? (
                                    <Pause size={14} className="fill-current" />
                                ) : (
                                    <Play size={14} className="fill-current ml-0.5" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded Mode: iPhone iOS Now Playing Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop Scrim (Prevents any see-through / overlap conflict) */}
                        <motion.div 
                            className="ios-player-scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                triggerHaptic();
                                setIsOpen(false);
                            }}
                            id="ios-player-scrim"
                        />

                        <motion.div 
                            className="ios-player-sheet"
                            id="ios-expanded-player"
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        >
                            {/* Top iOS Grabber / Pull Handle */}
                            <div 
                                className="ios-sheet-grabber-area"
                                onClick={() => {
                                    triggerHaptic();
                                    setIsOpen(false);
                                }}
                            >
                                <div className="ios-grabber-pill" />
                            </div>

                            {/* iOS Header Bar: AirPlay / Route Status */}
                            <div className="ios-header-row">
                                <div className="ios-route-badge">
                                    <Airplay size={13} className="ios-airplay-icon" />
                                    <span>iPhone • Speaker</span>
                                </div>

                                <div className="ios-header-actions">
                                    <button 
                                        className={`ios-pill-icon-btn ${isLooping ? 'active' : ''}`}
                                        onClick={toggleLoop}
                                        id="ios-repeat-btn"
                                        title={isLooping ? "Repeat active" : "Repeat track"}
                                        aria-label="Toggle repeat"
                                    >
                                        <RotateCcw size={14} />
                                    </button>

                                    <button 
                                        className="ios-pill-icon-btn"
                                        onClick={() => {
                                            triggerHaptic();
                                            setIsOpen(false);
                                        }}
                                        id="ios-collapse-btn"
                                        title="Minimize"
                                        aria-label="Minimize player"
                                    >
                                        <ChevronDown size={17} />
                                    </button>
                                </div>
                            </div>

                            {/* Hero Album Artwork (Scales like iOS 17/18 Apple Music) */}
                            <div className="ios-artwork-container">
                                <motion.div 
                                    className="ios-artwork-wrapper"
                                    animate={{ 
                                        scale: isPlaying ? 1 : 0.93,
                                        boxShadow: isPlaying 
                                            ? '0 20px 48px -10px rgba(0, 0, 0, 0.75)' 
                                            : '0 10px 25px -10px rgba(0, 0, 0, 0.5)'
                                    }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <img 
                                        src={settings.music.cover} 
                                        alt={settings.music.title} 
                                        className="ios-main-cover"
                                    />
                                </motion.div>
                            </div>

                            {/* Track Metadata & Favorite Button */}
                            <div className="ios-meta-row">
                                <div className="ios-meta-text">
                                    <h3 className="ios-song-title">{settings.music.title}</h3>
                                    <p className="ios-song-artist">{settings.music.artist}</p>
                                </div>

                                <button 
                                    className={`ios-heart-btn ${isLiked ? 'liked' : ''}`}
                                    onClick={toggleLiked}
                                    id="ios-favorite-btn"
                                    aria-label="Favorite song"
                                >
                                    <Heart 
                                        size={20} 
                                        className={isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"} 
                                    />
                                </button>
                            </div>

                            {/* iOS Time Scrubber */}
                            <div className="ios-scrubber-section">
                                <div 
                                    className="ios-scrubber-track"
                                    ref={progressRef}
                                    onClick={handleSeekClick}
                                    id="ios-scrubber-track"
                                >
                                    <div 
                                        className="ios-scrubber-fill"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="ios-scrubber-knob" />
                                    </div>
                                </div>

                                <div className="ios-time-labels">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(remainingTime, true)}</span>
                                </div>
                            </div>

                            {/* iOS Playback Controls */}
                            <div className="ios-controls-cluster">
                                <button 
                                    className="ios-nav-btn"
                                    onClick={() => skipSeconds(-10)}
                                    id="ios-skip-back-btn"
                                    title="Rewind 10 seconds"
                                    aria-label="Rewind 10 seconds"
                                >
                                    <SkipBack size={26} className="fill-current" />
                                </button>

                                <button 
                                    className="ios-primary-play-btn"
                                    onClick={togglePlay}
                                    id="ios-primary-play-btn"
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <Pause size={28} className="fill-current" />
                                    ) : (
                                        <Play size={28} className="fill-current ml-1" />
                                    )}
                                </button>

                                <button 
                                    className="ios-nav-btn"
                                    onClick={() => skipSeconds(10)}
                                    id="ios-skip-forward-btn"
                                    title="Forward 10 seconds"
                                    aria-label="Forward 10 seconds"
                                >
                                    <SkipForward size={26} className="fill-current" />
                                </button>
                            </div>

                            {/* iOS Volume Capsule Slider */}
                            <div className="ios-volume-row">
                                <button 
                                    className="ios-vol-icon-btn"
                                    onClick={toggleMute}
                                    id="ios-vol-mute-btn"
                                    aria-label="Toggle mute"
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX size={17} />
                                    ) : (
                                        <Volume1 size={17} />
                                    )}
                                </button>

                                <div className="ios-volume-slider-box">
                                    <input 
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.02"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setVolume(val);
                                            if (isMuted && val > 0) setIsMuted(false);
                                        }}
                                        className="ios-native-slider"
                                        id="ios-native-volume-slider"
                                        aria-label="Volume slider"
                                    />
                                </div>

                                <div className="ios-vol-max-icon">
                                    <Volume2 size={17} />
                                </div>
                            </div>

                            {/* Authentic Apple Music Audio Quality Footer */}
                            <div className="ios-footer-quality">
                                <span className="ios-quality-pill">Lossless</span>
                                <span className="ios-quality-spec">Apple Music • 24-bit / 48kHz ALAC</span>
                            </div>
                        </motion.div>
                    </>
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

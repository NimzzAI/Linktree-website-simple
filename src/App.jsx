import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    Copy, 
    Share2, 
    ExternalLink, 
    Clock, 
    Volume2, 
    VolumeX, 
    Layers, 
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { settings } from './settings.js';
import MusicPlayer from './MusicPlayer.jsx';
import ShareModal from './components/ShareModal.jsx';
import Toast from './components/Toast.jsx';
import './style.css';

const playClickHaptic = (enabled) => {
    if (!enabled || typeof window === 'undefined') return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.18
        }
    }
};

const cardVariants = {
    hidden: { 
        opacity: 0, 
        y: 18,
        filter: 'blur(3px)'
    },
    visible: { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const App = () => {
    const cardRef = useRef(null);
    const [bgMode, setBgMode] = useState('video');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [copiedHandle, setCopiedHandle] = useState(false);
    const [copiedLinkId, setCopiedLinkId] = useState(null);
    const [showTime, setShowTime] = useState(true);
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setTimeStr(`${formatted} WIB`);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2500);
    };

    const handleCopyHandle = async () => {
        playClickHaptic(soundEnabled);
        try {
            await navigator.clipboard.writeText(settings.profile.username);
            setCopiedHandle(true);
            triggerToast(`Copied ${settings.profile.handle}`);
            setTimeout(() => setCopiedHandle(false), 2000);
        } catch (e) {
            triggerToast("Failed to copy handle");
        }
    };

    const handleCopyLink = async (e, link) => {
        e.preventDefault();
        e.stopPropagation();
        playClickHaptic(soundEnabled);
        try {
            await navigator.clipboard.writeText(link.url);
            setCopiedLinkId(link.id);
            triggerToast(`Copied ${link.title} URL`);
            setTimeout(() => setCopiedLinkId(null), 2000);
        } catch (e) {
            triggerToast("Failed to copy link");
        }
    };

    const cycleBgMode = () => {
        playClickHaptic(soundEnabled);
        const modes = ['video', 'obsidian', 'studio'];
        const nextIdx = (modes.indexOf(bgMode) + 1) % modes.length;
        const nextMode = modes[nextIdx];
        setBgMode(nextMode);
        const titles = { video: 'Cinema View', obsidian: 'Minimal Dark', studio: 'Studio Ambient' };
        triggerToast(titles[nextMode]);
    };

    return (
        <div className={`app-wrapper mode-${bgMode}`}>
            <Toast message={toastMessage} />

            {bgMode === 'video' && (
                <video autoPlay muted loop playsInline id="bg-video">
                    <source src={settings.profile.videoBg} type="video/mp4" />
                </video>
            )}

            {bgMode === 'studio' && (
                <div className="studio-ambient-canvas" />
            )}

            {bgMode === 'obsidian' && (
                <div className="obsidian-ambient-canvas" />
            )}

            <div className="top-hud-bar">
                <div className="hud-badge-group">
                    <button 
                        className="hud-pill-btn" 
                        onClick={() => {
                            playClickHaptic(soundEnabled);
                            const next = !showTime;
                            setShowTime(next);
                            triggerToast(next ? "Jam Jakarta (WIB)" : `Status: ${settings.profile.status}`);
                        }}
                        id="hud-status-toggle"
                        title="Klik untuk beralih antara Jam Indonesia Jakarta (WIB) dan Status"
                        aria-label="Toggle clock and status"
                    >
                        <span className="live-ping" />
                        <span className="hud-label">
                            {showTime ? timeStr : settings.profile.status}
                        </span>
                        <Clock size={12} className="hud-clock-icon" />
                    </button>
                </div>

                <div className="hud-actions-group">
                    <button 
                        className="hud-circle-btn" 
                        onClick={cycleBgMode}
                        title="Change Theme Backdrop"
                        id="hud-bg-mode-btn"
                        aria-label="Change backdrop"
                    >
                        <Layers size={14} />
                    </button>

                    <button 
                        className="hud-circle-btn" 
                        onClick={() => {
                            const next = !soundEnabled;
                            setSoundEnabled(next);
                            triggerToast(next ? "Sound: Enabled" : "Sound: Muted");
                        }}
                        title="Toggle Interaction Audio"
                        id="hud-sound-toggle-btn"
                        aria-label="Toggle sound"
                    >
                        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>

                    <button 
                        className="hud-circle-btn" 
                        onClick={() => {
                            playClickHaptic(soundEnabled);
                            setShowShareModal(true);
                        }}
                        title="Share Profile"
                        id="hud-share-btn"
                        aria-label="Share profile"
                    >
                        <Share2 size={14} />
                    </button>
                </div>
            </div>

            <main className="main-content-area">
                <motion.div 
                    ref={cardRef}
                    className="glass-container"
                    id="profile-main-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="profile-hero">
                        <div className="avatar-wrapper" id="avatar-container">
                            <img 
                                src={settings.profile.avatar} 
                                alt={settings.profile.name} 
                                className="avatar-image"
                            />
                        </div>

                        <div className="profile-identity">
                            <h1 className="display-name">{settings.profile.name}</h1>

                            <div className="handle-row">
                                <span className="handle-text">{settings.profile.handle}</span>
                                <button 
                                    className="copy-handle-btn"
                                    onClick={handleCopyHandle}
                                    id="copy-github-handle-btn"
                                    aria-label="Copy GitHub handle"
                                >
                                    {copiedHandle ? <Check size={11} /> : <Copy size={11} />}
                                    <span>{copiedHandle ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>

                            <div className="role-headline">
                                <span>{settings.profile.title}</span>
                                <span className="headline-divider">•</span>
                                <span className="location-tag">
                                    <MapPin size={11} />
                                    {settings.profile.location}
                                </span>
                            </div>

                            <p className="profile-bio-text">
                                {settings.profile.bio}
                            </p>
                        </div>
                    </div>

                    <div className="stack-pill-cloud">
                        {settings.profile.stack.map((item, index) => (
                            <span key={index} className="stack-pill" id={`stack-pill-${index}`}>
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="links-section-header">
                        <span className="section-title">Verified Links</span>
                        <span className="section-counter">{settings.links.length} online</span>
                    </div>

                    <motion.div 
                        className="social-links-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {settings.links.map((link) => (
                            <motion.a 
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link-card"
                                id={`link-card-${link.id}`}
                                variants={cardVariants}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => playClickHaptic(soundEnabled)}
                            >
                                <div className="link-icon-box">
                                    <i className={link.icon}></i>
                                </div>

                                <div className="link-info-col">
                                    <div className="link-title-row">
                                        <span className="link-primary-title">{link.title}</span>
                                        {link.tag && (
                                            <span className="link-tag-pill">{link.tag}</span>
                                        )}
                                    </div>
                                    <span className="link-subtitle-text">{link.subtitle}</span>
                                </div>

                                <div className="link-actions-cluster">
                                    <button 
                                        className="link-quick-copy"
                                        onClick={(e) => handleCopyLink(e, link)}
                                        title={`Copy ${link.title} URL`}
                                        id={`copy-btn-${link.id}`}
                                        aria-label={`Copy ${link.title} link`}
                                    >
                                        {copiedLinkId === link.id ? (
                                            <Check size={13} className="text-emerald" />
                                        ) : (
                                            <Copy size={13} />
                                        )}
                                    </button>

                                    <div className="link-arrow-box">
                                        <ArrowUpRight size={15} />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>

                <footer className="footer-credits">
                    <p>{settings.profile.name} • {new Date().getFullYear()}</p>
                </footer>
            </main>

            <MusicPlayer onToast={triggerToast} soundEnabled={soundEnabled} />

            <ShareModal 
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                profileUrl={settings.site.siteUrl}
                profileName={settings.profile.name}
                onToast={triggerToast}
            />
        </div>
    );
};

export default App;

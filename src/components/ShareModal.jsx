import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, QrCode, Share2, ExternalLink } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, profileUrl, profileName, onToast }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            onToast?.("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2200);
        } catch (err) {
            onToast?.("Failed to copy link");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${profileName} | Linktree`,
                    text: `Check out ${profileName}'s official links and profile!`,
                    url: profileUrl,
                });
            } catch (err) {}
        } else {
            handleCopy();
        }
    };

    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=ffffff&bgcolor=121217&margin=10`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-backdrop" onClick={onClose} id="share-modal-backdrop">
                    <motion.div 
                        className="modal-content glass-card"
                        id="share-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="modal-header">
                            <div className="modal-title-group">
                                <div className="modal-icon-badge">
                                    <Share2 size={18} />
                                </div>
                                <div>
                                    <h3 className="modal-title">Share Profile</h3>
                                    <p className="modal-subtitle">Connect with {profileName}</p>
                                </div>
                            </div>
                            <button 
                                className="modal-close-btn"
                                onClick={onClose}
                                id="modal-close-button"
                                aria-label="Close modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="qr-container">
                            <div className="qr-box">
                                <img 
                                    src={qrCodeApiUrl} 
                                    alt="QR Code" 
                                    className="qr-image" 
                                    loading="lazy"
                                />
                                <div className="qr-badge">
                                    <QrCode size={12} /> Scan to visit
                                </div>
                            </div>
                        </div>

                        <div className="share-url-bar">
                            <span className="share-url-text">{profileUrl}</span>
                            <button 
                                className={`copy-url-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopy}
                                id="modal-copy-url-btn"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>

                        <div className="modal-actions">
                            {typeof navigator !== 'undefined' && navigator.share && (
                                <button 
                                    className="share-action-btn primary"
                                    onClick={handleNativeShare}
                                    id="modal-native-share-btn"
                                >
                                    <Share2 size={16} />
                                    <span>Share via Device</span>
                                </button>
                            )}
                            <a 
                                href={profileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="share-action-btn secondary"
                                id="modal-open-link-btn"
                            >
                                <ExternalLink size={16} />
                                <span>Open Link</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;

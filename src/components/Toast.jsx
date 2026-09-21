import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div 
                    className="toast-pill"
                    id="app-toast-notification"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    <CheckCircle2 size={15} className="toast-icon" />
                    <span className="toast-text">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;

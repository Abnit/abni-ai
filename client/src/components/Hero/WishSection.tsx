import React from 'react';
import { motion } from 'framer-motion';
import '../../styles.css';

interface WishSectionProps {
    isChatMode: boolean;
}

const WishSection: React.FC<WishSectionProps> = ({ isChatMode }) => {
    return (
        <motion.div 
            className="wish-section"
            initial={{ opacity: 1, x: 0, scale: 1 }}
            animate={{ 
                opacity: isChatMode ? 0 : 1, 
                x: isChatMode ? '-100vw' : 0, 
                scale: isChatMode ? 0.8 : 1 
            }}
            transition={{ duration: 0.8 }}
        >
            <h1>Abni-Simply Smarter<br /></h1>
            <p style={{ opacity: 0.6, marginTop: '10px', fontSize: '1.1rem' }}>How can I help you today?</p>
        </motion.div>
    );
};

export default WishSection;

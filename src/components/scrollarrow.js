import React, { useState, useEffect, useCallback } from 'react';
import '../styles/scrollarrow.css';
import { FaArrowUp } from 'react-icons/fa';

const ScrollArrow = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(window.pageYOffset > 300);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [toggleVisibility]);

    return (
        isVisible && (
            <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
                <FaArrowUp size={40} />
            </div>
        )
    );
};

export default ScrollArrow;
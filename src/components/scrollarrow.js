import React, { useState, useEffect, useCallback } from 'react';
import '../styles/scrollarrow.css';
import { FaArrowUp } from 'react-icons/fa';

const ScrollArrow = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(window.pageYOffset > 300);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        // Initial check in case page is already scrolled
        toggleVisibility();

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [toggleVisibility]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="scroll-to-top visible"
            onClick={scrollToTop}
            onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}
            role="button"
            tabIndex={0}
            aria-label="Scroll to top"
        >
            <FaArrowUp size={40} />
        </div>
    );
};

export default React.memo(ScrollArrow);
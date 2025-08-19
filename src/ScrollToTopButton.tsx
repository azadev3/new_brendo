import { useEffect, useState } from 'react';
import { FaArrowTurnUp } from 'react-icons/fa6';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!isVisible) return null;
    return (
        <div className="scroll-top" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
            <div className="button-top">
                <FaArrowTurnUp className="to-top-icon" />
            </div>
        </div>
    );
};

export default ScrollToTopButton;

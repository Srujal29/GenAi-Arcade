import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BootOverlay = ({ onBootComplete }) => {
    const bootTextRef = useRef(null);
    const overlayRef = useRef(null); // Ref for the main overlay div

    useEffect(() => {
        // Use a flag to prevent multiple calls and stop animation if component unmounts
        let isMounted = true;
        
        const bootTextEl = bootTextRef.current;
        const lines = ["INITIALIZING...", "LOADING PROTOCOLS...", "CALIBRATING...", "SYSTEM ONLINE."];
        let lineIndex = 0;
        let charIndex = 0;

        const type = () => {
            if (!isMounted) return;

            // When all lines are typed
            if (lineIndex >= lines.length) {
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        // Only call the completion handler if still mounted
                        if (isMounted) onBootComplete();
                    },
                });
                return;
            }

            // Type out the current line
            if (charIndex < lines[lineIndex].length) {
                bootTextEl.textContent += lines[lineIndex].charAt(charIndex++);
                setTimeout(type, 50);
            } else {
                // Wait a bit, then move to the next line
                setTimeout(() => {
                    lineIndex++;
                    charIndex = 0;
                    if(bootTextEl) bootTextEl.textContent = ''; // Check if element exists before clearing
                    type();
                }, 500);
            }
        };

        // Start the typing animation
        type();

        // Cleanup function: runs when the component unmounts
        return () => {
            isMounted = false;
        };
    }, [onBootComplete]);

    return (
        <div id="boot-overlay" ref={overlayRef}>
            <p id="boot-text" ref={bootTextRef}></p>
        </div>
    );
};

export default BootOverlay;
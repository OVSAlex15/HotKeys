
import React, { useEffect, useRef, useState } from 'react';

interface TrackingEyeProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  watchInput?: boolean;
  className?: string;
  size?: number;
}

const TrackingEye: React.FC<TrackingEyeProps> = ({ 
  inputRef, 
  watchInput = false, 
  className = '', 
  size = 100 
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  
  // Track mouse movement when not watching input
  useEffect(() => {
    if (!watchInput) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!eyeRef.current) return;
        
        const eyeRect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        // Calculate angle between mouse and eye center
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        
        // Max movement range (% of eye size)
        const maxRange = 0.2; 
        
        // Calculate new pupil position
        const x = Math.cos(angle) * maxRange * (size / 3);
        const y = Math.sin(angle) * maxRange * (size / 3);
        
        setPupilPosition({ x, y });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [watchInput, size]);
  
  // Track input text when watching input
  useEffect(() => {
    if (watchInput && inputRef?.current) {
      const updatePupilPosition = () => {
        const input = inputRef.current;
        if (!input) return;
        
        const cursorPosition = input.selectionStart || 0;
        const inputValue = input.value;
        const inputLength = Math.max(inputValue.length, 1);
        
        // Calculate pupil position based on cursor position relative to input length
        // This creates a more natural left-to-right eye movement
        const inputProgress = cursorPosition / inputLength;
        const xPosition = (inputProgress * 2 - 1) * (size / 6); // Scale to reasonable range
        
        setPupilPosition({ 
          x: xPosition,
          y: 0
        });
      };
      
      const handleFocus = () => {
        // Reset eye position when focused
        updatePupilPosition();
      };
      
      const input = inputRef.current;
      input.addEventListener('input', updatePupilPosition);
      input.addEventListener('click', updatePupilPosition);
      input.addEventListener('keyup', updatePupilPosition);
      input.addEventListener('focus', handleFocus);
      
      // Initial position update
      updatePupilPosition();
      
      return () => {
        input.removeEventListener('input', updatePupilPosition);
        input.removeEventListener('click', updatePupilPosition);
        input.removeEventListener('keyup', updatePupilPosition);
        input.removeEventListener('focus', handleFocus);
      };
    }
  }, [watchInput, inputRef, size]);
  
  return (
    <div 
      ref={eyeRef}
      className={`relative ${className}`}
      style={{ width: `${size}px`, height: `${size / 2}px` }}
    >
      {/* Eye outline */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 5,25 C 5,15 25,0 50,0 C 75,0 95,15 95,25 C 95,35 75,50 50,50 C 25,50 5,35 5,25 Z" 
          fill="white" 
          stroke="#2563EB" 
          strokeWidth="3"
        />
      </svg>
      
      {/* Pupil */}
      <div 
        className="absolute bg-blue-700 rounded-full transition-transform duration-200"
        style={{
          width: `${size / 4}px`, 
          height: `${size / 4}px`,
          top: `${size / 4 - size / 8 + pupilPosition.y}px`,
          left: `${size / 2 - size / 8 + pupilPosition.x}px`,
          transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        }}
      ></div>
    </div>
  );
};

export default TrackingEye;

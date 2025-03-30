
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import TrackingEye from './TrackingEye';

interface LogoProps {
  className?: string;
  watchInput?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  useCustomEye?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, watchInput = false, inputRef, useCustomEye = false }) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (watchInput && inputRef?.current && !useCustomEye) {
      const updateEyePosition = () => {
        const input = inputRef.current;
        if (!input) return;
        
        const cursorPosition = input.selectionStart || 0;
        const inputValue = input.value;
        const inputLength = inputValue.length;
        
        // Calculate normalized position (0 to 1)
        const normalizedX = inputLength > 0 ? cursorPosition / inputLength : 0;
        
        // Set eye position with a slight delay to make it more natural
        setTimeout(() => {
          setEyePosition({ 
            x: normalizedX * 10 - 5, // Range: -5 to 5
            y: 0
          });
        }, 50);
      };
      
      const input = inputRef.current;
      input.addEventListener('input', updateEyePosition);
      input.addEventListener('click', updateEyePosition);
      input.addEventListener('keyup', updateEyePosition);
      
      return () => {
        input.removeEventListener('input', updateEyePosition);
        input.removeEventListener('click', updateEyePosition);
        input.removeEventListener('keyup', updateEyePosition);
      };
    }
  }, [watchInput, inputRef, useCustomEye]);
  
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 font-bold text-eyesafe-dark transition-all hover:opacity-80 ${className}`}
    >
      <div className="relative">
        {useCustomEye ? (
          <TrackingEye 
            size={24} 
            watchInput={watchInput} 
            inputRef={inputRef} 
          />
        ) : (
          <Eye 
            className="h-6 w-6" 
            style={watchInput ? {
              transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
              transition: 'transform 0.2s ease-out'
            } : {}}
          />
        )}
      </div>
      <span className="text-2xl">Eyesafe</span>
    </Link>
  );
};

export default Logo;

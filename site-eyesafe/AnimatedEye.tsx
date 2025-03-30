import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedEyeProps {
  inputLength: number;
  className?: string;
}

const AnimatedEye: React.FC<AnimatedEyeProps> = ({ inputLength, className }) => {
  const [pupilPosition, setPupilPosition] = useState(0);
  const previousInputLength = useRef(inputLength);

  useEffect(() => {
    const direction = inputLength > previousInputLength.current ? 1 : -1;
  
    const newPosition = Math.min(Math.max(pupilPosition + (direction * 0.1), -15), 15);
    
    setPupilPosition(newPosition);
    previousInputLength.current = inputLength;
  }, [inputLength, pupilPosition]);

  return (
    <div className={cn("relative w-32 h-16 mx-auto mb-6", className)}>
      <div className="absolute w-full h-full bg-white rounded-full border border-gray-200 shadow-inner overflow-hidden">
        <div className="absolute w-16 h-16 bg-blue-100 rounded-full left-1/2 -translate-x-1/2 top-0"></div>
        <div 
          className="absolute w-8 h-8 bg-gray-900 rounded-full top-1/4"
          style={{ 
            left: `calc(50% - 16px + ${pupilPosition}px)`,
            transition: 'left 0.5s ease-out'
          }}
        ></div>
        <div className="absolute w-3 h-3 bg-white rounded-full top-1/4 left-[46%] opacity-80"></div>
        <div className="absolute w-full h-full bg-transparent overflow-hidden">
          <div className="absolute inset-0 bg-background origin-top scale-y-0 hover:scale-y-100 transition-transform duration-200"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedEye;
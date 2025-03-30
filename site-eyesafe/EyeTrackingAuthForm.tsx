
import React, { useRef } from 'react';
import AuthForm from './AuthForm';
import TrackingEye from './TrackingEye';

interface EyeTrackingAuthFormProps {
  type: "signin" | "signup";
  onSubmit: (values: any) => void;
}

const EyeTrackingAuthForm: React.FC<EyeTrackingAuthFormProps> = ({ type, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col items-center">
      <TrackingEye 
        watchInput={true} 
        inputRef={inputRef} 
        size={120} 
        className="mb-8 mx-auto"
      />
      
      <AuthForm 
        type={type} 
        onSubmit={onSubmit} 
        inputRef={inputRef}
      />
    </div>
  );
};

export default EyeTrackingAuthForm;

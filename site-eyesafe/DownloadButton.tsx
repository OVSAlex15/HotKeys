
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Apple, Monitor } from 'lucide-react';

interface DownloadButtonProps {
  platform: 'mac' | 'windows';
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ platform, className }) => {
  const icon = platform === 'mac' ? Apple : Monitor;
  const text = platform === 'mac' ? 'Download for Mac' : 'Download for Windows';
  const version = platform === 'mac' ? 'v1.2.0' : 'v1.2.0';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <Button 
        className="flex items-center gap-2 w-full py-6 rounded-xl transition-all-ease hover:translate-y-[-2px]"
        size="lg"
      >
        <Download className="h-5 w-5" />
        <div className="flex flex-col">
          <span>{text}</span>
          <span className="text-xs opacity-80">{version}</span>
        </div>
      </Button>
    </div>
  );
};

export default DownloadButton;

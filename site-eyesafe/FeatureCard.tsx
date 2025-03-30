
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="group glass-card rounded-xl p-6 transition-all-ease hover:scale-[1.02] hover:shadow-md">
      <div className="feature-icon-container mb-4 group-hover:scale-110 transition-all-ease">
        <div className="feature-icon-bg" />
        <Icon className="feature-icon h-6 w-6" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;

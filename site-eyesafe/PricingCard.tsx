
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
  onSelect
}) => {
  return (
    <div 
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all-ease ${
        popular 
          ? 'border-2 border-primary shadow-lg' 
          : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      
      <div className="p-6 flex flex-col h-full">
        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        
        <div className="mb-5">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            {price !== 'Free' && <span className="text-gray-500 ml-1">/month</span>}
          </div>
        </div>
        
        <ul className="mb-8 space-y-3 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-gray-300'}`}>
                <Check className="h-4 w-4" />
              </div>
              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSelect}
          variant={popular ? "default" : "outline"} 
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;

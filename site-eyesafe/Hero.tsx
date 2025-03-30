
import React from 'react';
import { ArrowRight, Shield, Eye, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-28 pb-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
            <span className="flex items-center">
              <Shield className="mr-1 h-3 w-3" />
              Vision Protection Technology
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter animate-slide-down">
            Protect Your Vision <br />
            <span className="heading-gradient">While Using Your Computer</span>
          </h1>
          
          <p className="max-w-[700px] text-gray-500 md:text-xl animate-slide-up">
            Eyesafe monitors your posture, screen distance, and room lighting to protect your vision during long computer sessions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/#download">
                Download Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="feature-icon-container">
                <div className="feature-icon-bg" />
                <Eye className="feature-icon h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Eye Distance Tracking</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="feature-icon-container">
                <div className="feature-icon-bg" />
                <Monitor className="feature-icon h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Posture Monitoring</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="feature-icon-container">
                <div className="feature-icon-bg" />
                <svg 
                  className="feature-icon h-6 w-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </div>
              <p className="text-sm font-medium">Lighting Detection</p>
            </div>
          </div>
        </div>
        
        <div className="relative mt-16 rounded-xl overflow-hidden animate-fade-in animate-floating" style={{ animationDelay: '0.7s' }}>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 p-1 backdrop-blur">
            <div className="h-full w-full bg-white rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/981dacc3-a81a-466b-ac41-21d6b0cf32c3.png" 
                alt="Eyesafe Application Screenshot" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

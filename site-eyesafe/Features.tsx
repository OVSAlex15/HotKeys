
import React from 'react';
import { Eye, Activity, AlertTriangle, Bell, Clock, Zap, Moon, Laptop, BarChart3 } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: Eye,
      title: "Eye Distance Tracking",
      description: "Monitors the distance between your eyes and the screen, reminding you to maintain a healthy distance."
    },
    {
      icon: Activity,
      title: "Posture Monitoring",
      description: "Analyzes your sitting position to help prevent neck and back strain during long computer sessions."
    },
    {
      icon: Laptop,
      title: "Lighting Detection",
      description: "Evaluates ambient lighting conditions and suggests optimal settings to reduce eye strain."
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Provides timely notifications for breaks, posture corrections, and distance adjustments."
    },
    {
      icon: Clock,
      title: "Screen Time Tracking",
      description: "Monitors your computer usage and encourages healthy screen time habits."
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Continuously evaluates your working conditions and provides instant feedback."
    },
    {
      icon: Moon,
      title: "Night Mode Suggestions",
      description: "Recommends display settings based on time of day to reduce blue light exposure."
    },
    {
      icon: AlertTriangle,
      title: "Preventive Alerts",
      description: "Warns you about conditions that may lead to eye strain or vision problems."
    },
    {
      icon: BarChart3,
      title: "Vision Health Analytics",
      description: "Tracks your habits over time and provides insights to improve your digital health."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Comprehensive Vision Protection Features
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Eyesafe combines advanced technology with ergonomic best practices to provide complete protection for your vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in" 
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

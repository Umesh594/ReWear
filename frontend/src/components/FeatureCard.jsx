import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description, gradient }) => {
  return (
    <Card className={`${gradient} border-0 text-white mb-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
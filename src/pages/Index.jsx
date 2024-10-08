import React from 'react';
import UltimateReasoningSystem from '../components/UltimateReasoningSystem';
import { Beaker } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex items-center">
        <Beaker className="mr-2" />
        高度推論システム：Cognitum
      </h1>
      <UltimateReasoningSystem />
    </div>
  );
};

export default Index;
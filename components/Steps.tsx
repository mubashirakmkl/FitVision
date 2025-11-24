import React from 'react';
import { AppStep } from '../types';

interface StepsProps {
  currentStep: AppStep;
}

export const Steps: React.FC<StepsProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.Profile, label: 'Profile' },
    { id: AppStep.Photo, label: 'Photo' },
    { id: AppStep.Target, label: 'Goal' },
    { id: AppStep.Result, label: 'Vision' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center space-x-2 md:space-x-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300
                  ${isActive ? 'border-brand-500 bg-brand-500 text-white scale-110 shadow-lg shadow-brand-200' : ''}
                  ${isCompleted ? 'border-brand-500 bg-white text-brand-500' : ''}
                  ${!isActive && !isCompleted ? 'border-slate-300 text-slate-400' : ''}
                `}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span 
                className={`
                  ml-2 text-sm font-medium hidden md:block
                  ${isActive ? 'text-brand-600' : 'text-slate-400'}
                `}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 md:mx-4 ${isCompleted ? 'bg-brand-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

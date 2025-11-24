import React, { useState } from 'react';
import { Steps } from './components/Steps';
import { ProfileForm } from './components/ProfileForm';
import { PhotoUpload } from './components/PhotoUpload';
import { TargetSetting } from './components/TargetSetting';
import { ResultView } from './components/ResultView';
import { AppStep, UserProfile, Gender } from './types';
import { Dumbbell } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.Profile);
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    gender: Gender.Male,
    heightCm: 0,
    currentWeightKg: 0,
    targetWeightKg: 0,
    photo: null
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetApp = () => {
    setCurrentStep(AppStep.Profile);
    setProfile({
        age: 0,
        gender: Gender.Male,
        heightCm: 0,
        currentWeightKg: 0,
        targetWeightKg: 0,
        photo: null
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.Profile:
        return <ProfileForm profile={profile} setProfile={setProfile} onNext={nextStep} />;
      case AppStep.Photo:
        return <PhotoUpload profile={profile} setProfile={setProfile} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Target:
        return <TargetSetting profile={profile} setProfile={setProfile} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Result:
        return <ResultView profile={profile} onReset={resetApp} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50/30">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <Dumbbell size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
              FitVision
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-1 rounded-md">
            Nano Banana AI
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-2">
            Visualize Your Weight Loss Journey
          </h1>
          <p className="text-center text-slate-500 max-w-2xl mx-auto">
            See the healthier, fitter version of yourself instantly using advanced AI. Set a realistic target and get motivated today.
          </p>
        </div>

        <Steps currentStep={currentStep} />
        
        <div className="mt-8 flex justify-center">
          {renderStep()}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} FitVision. Powered by Google Gemini 2.5 (Nano Banana).</p>
      </footer>
    </div>
  );
};

export default App;

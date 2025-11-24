import React, { useEffect, useState } from 'react';
import { UserProfile, GenerationState } from '../types';
import { generateBetterVersion } from '../services/geminiService';
import { Download, RefreshCw, Sparkles, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface ResultViewProps {
  profile: UserProfile;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ profile, onReset }) => {
  const [state, setState] = useState<GenerationState>({
    isGenerating: true,
    error: null,
    resultImage: null
  });

  useEffect(() => {
    let mounted = true;
    
    const runGeneration = async () => {
      try {
        const image = await generateBetterVersion(profile);
        if (mounted) {
          setState({ isGenerating: false, error: null, resultImage: image });
        }
      } catch (err: any) {
        if (mounted) {
          setState({ 
            isGenerating: false, 
            error: err.message || "Failed to generate image. Please try again.", 
            resultImage: null 
          });
        }
      }
    };

    runGeneration();

    return () => { mounted = false; };
  }, [profile]);

  const handleDownload = () => {
    if (state.resultImage) {
      const link = document.createElement('a');
      link.href = state.resultImage;
      link.download = `fitvision-target-${profile.targetWeightKg}kg.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (state.isGenerating) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full mx-auto text-center animate-fade-in-up">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader2 className="text-brand-500 animate-spin-slow" size={32} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing physique...</h3>
        <p className="text-slate-500 mb-4">Applying realistic weight loss physics to reach {profile.targetWeightKg}kg.</p>
        <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 py-2 px-4 rounded-full">
            <Sparkles size={12} />
            <span>Preserving skin texture & lighting</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-lg w-full mx-auto text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Generation Failed</h3>
        <p className="text-slate-500 mb-6">{state.error}</p>
        <button
          onClick={onReset}
          className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Transformation</h2>
        <p className="text-slate-600">Goal: <span className="font-bold text-brand-600">{profile.targetWeightKg}kg</span> (Loss of {profile.currentWeightKg - profile.targetWeightKg}kg)</p>
      </div>

      {/* Side-by-Side Comparison View */}
      <div className="relative flex flex-col md:flex-row w-full gap-1 md:gap-1 max-w-5xl mx-auto mb-8 bg-slate-100 p-1 rounded-3xl shadow-inner">
        
        {/* Before Image */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[550px] group">
           <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Current</div>
           <div className="absolute bottom-4 left-4 z-10 text-white drop-shadow-md">
              <p className="text-3xl font-bold">{profile.currentWeightKg} <span className="text-sm font-normal opacity-80">kg</span></p>
           </div>
           <img 
             src={profile.photo!} 
             className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none transition-transform duration-500" 
             alt="Before" 
           />
           {/* Overlay gradient for text readability */}
           <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent rounded-bl-none md:rounded-bl-2xl"></div>
        </div>

        {/* After Image */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[550px] group overflow-hidden rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
           <div className="absolute top-4 right-4 z-10 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg shadow-brand-500/30 flex items-center gap-1">
             <Sparkles size={12} /> Target
           </div>
            <div className="absolute bottom-4 right-4 z-10 text-white drop-shadow-md text-right">
              <p className="text-3xl font-bold text-brand-300">{profile.targetWeightKg} <span className="text-sm font-normal text-white opacity-80">kg</span></p>
              <p className="text-xs font-medium text-brand-100">AI Generated</p>
           </div>
           {state.resultImage ? (
               <img 
                 src={state.resultImage} 
                 className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                 alt="After" 
               />
           ) : (
               <div className="w-full h-full bg-slate-200 animate-pulse" />
           )}
           {/* Overlay gradient for text readability */}
           <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-900/60 to-transparent rounded-br-2xl"></div>
        </div>
        
        {/* Center Badge (Desktop only) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl border-4 border-slate-100">
            <ArrowRight className="text-slate-300 mb-1" size={16} />
            <span className="text-brand-600 font-black text-lg">-{profile.currentWeightKg - profile.targetWeightKg}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">KG</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8 flex items-start gap-3">
            <InfoIcon className="text-brand-600 mt-1 shrink-0" size={18} />
            <p className="text-brand-900 text-sm">
              This image is generated for visualization purposes. The AI preserves your skin texture and lighting to make it look realistic, but actual weight loss results will vary.
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center py-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={20} className="mr-2" /> Start New
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center py-4 rounded-xl font-bold text-lg bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
          >
            <Download size={20} className="mr-2" /> Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const InfoIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
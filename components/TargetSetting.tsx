import React from 'react';
import { UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TargetSettingProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNext: () => void;
  onBack: () => void;
}

export const TargetSetting: React.FC<TargetSettingProps> = ({ profile, setProfile, onNext, onBack }) => {
  // Initialize target weight if not set
  React.useEffect(() => {
    if (profile.targetWeightKg === 0) {
      setProfile(prev => ({ ...prev, targetWeightKg: Math.round(prev.currentWeightKg * 0.9) }));
    }
  }, [profile.currentWeightKg, setProfile, profile.targetWeightKg]);

  const heightM = profile.heightCm / 100;
  const currentBMI = (profile.currentWeightKg / (heightM * heightM)).toFixed(1);
  const targetBMI = (profile.targetWeightKg / (heightM * heightM)).toFixed(1);
  
  const lossAmount = profile.currentWeightKg - profile.targetWeightKg;
  const percentageLoss = ((lossAmount / profile.currentWeightKg) * 100).toFixed(1);
  
  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return '#facc15'; // Yellow
    if (bmi < 25) return '#22c55e'; // Green
    if (bmi < 30) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const chartData = [
    { name: 'Current', weight: profile.currentWeightKg, color: '#94a3b8' },
    { name: 'Target', weight: profile.targetWeightKg, color: '#22c55e' },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Set Your Goal</h2>
      <p className="text-slate-500 text-center mb-8">How much weight do you want to lose?</p>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
           <span className="text-slate-600 font-medium">Target Weight</span>
           <span className="text-4xl font-bold text-brand-600">{profile.targetWeightKg} <span className="text-lg text-slate-400">kg</span></span>
        </div>
        
        <input
          type="range"
          min={Math.round(profile.currentWeightKg * 0.5)}
          max={profile.currentWeightKg}
          value={profile.targetWeightKg}
          onChange={(e) => setProfile(prev => ({ ...prev, targetWeightKg: Number(e.target.value) }))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        
        <div className="flex justify-between mt-2 text-xs text-slate-400">
           <span>Ambitions</span>
           <span>Current: {profile.currentWeightKg}kg</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <div className="text-sm text-slate-500 mb-1">Total Loss</div>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">-{lossAmount} kg</span>
                <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full mt-1">
                   {percentageLoss}% Body Mass
                </span>
            </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <div className="text-sm text-slate-500 mb-1">Target BMI</div>
            <div className="text-2xl font-bold" style={{ color: getBMIColor(Number(targetBMI)) }}>{targetBMI}</div>
            <div className="text-[10px] text-slate-400">Prev: {currentBMI}</div>
        </div>
      </div>

      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12}} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-xl font-bold text-lg bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Visualize It
        </button>
      </div>
    </div>
  );
};
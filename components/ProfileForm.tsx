import React from 'react';
import { Gender, UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNext: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Number(value)
    }));
  };

  const isValid = profile.age > 0 && profile.heightCm > 0 && profile.currentWeightKg > 0;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Tell us about you</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="25"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value={Gender.Male}>Male</option>
              <option value={Gender.Female}>Female</option>
              <option value={Gender.Other}>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Height (cm)</label>
          <input
            type="number"
            name="heightCm"
            value={profile.heightCm || ''}
            onChange={handleChange}
            placeholder="175"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Current Weight (kg)</label>
          <input
            type="number"
            name="currentWeightKg"
            value={profile.currentWeightKg || ''}
            onChange={handleChange}
            placeholder="80"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
          ${isValid 
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
        `}
      >
        Next Step
      </button>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { UserProfile } from '../types';
import { Camera, Upload, Trash2, Info, CheckCircle2, XCircle } from 'lucide-react';

interface PhotoUploadProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNext: () => void;
  onBack: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ profile, setProfile, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setProfile(prev => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Upload Your Photo</h2>
      <p className="text-slate-500 text-center mb-6">A clear full-body or half-body shot works best.</p>

      {/* Enhanced Realism Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-blue-600" size={20} />
          <h3 className="font-bold text-blue-900">How to get a realistic result</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
             <div className="flex items-start gap-2 text-green-700">
               <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
               <span><strong>Natural Lighting:</strong> Daylight is best. Avoid harsh flash.</span>
             </div>
             <div className="flex items-start gap-2 text-green-700">
               <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
               <span><strong>No Filters:</strong> Use a raw camera photo. Beauty filters cause "plastic" AI skin.</span>
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex items-start gap-2 text-slate-600">
               <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
               <span><strong>Simple Background:</strong> Helps the AI focus on your physique.</span>
             </div>
             <div className="flex items-start gap-2 text-red-600/80">
               <XCircle size={16} className="mt-0.5 shrink-0" />
               <span><strong>Avoid:</strong> Heavy makeup, baggy clothes that hide your shape.</span>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {!profile.photo ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all group min-h-[300px]"
          >
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Upload size={36} />
            </div>
            <p className="text-xl font-semibold text-slate-700 mb-1">Upload your photo</p>
            <p className="text-slate-400">JPG or PNG (Max 5MB)</p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden shadow-md group">
            <img src={profile.photo} alt="Preview" className="w-full max-h-[500px] object-contain bg-slate-100" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={clearPhoto}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold flex items-center hover:bg-red-50 hover:text-red-600 transition-colors shadow-xl"
              >
                <Trash2 size={20} className="mr-2" /> Change Photo
              </button>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2">
            <XCircle size={18} />
            {error}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!profile.photo}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
            ${profile.photo 
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
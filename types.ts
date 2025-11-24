export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  photo: string | null; // Base64 string
}

export enum AppStep {
  Profile = 0,
  Photo = 1,
  Target = 2,
  Result = 3
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null;
}

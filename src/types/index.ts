export interface Issue {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserProfile {
  selectedIssues: string[];
  ageGroup: string;
  communityRole: string[];
  zipCode: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photo: string;
  positions: string[];
  officeId: string;
  isStarred: boolean;
}

export interface BallotMeasure {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  isStarred: boolean;
}

export interface Office {
  id: string;
  name: string;
  description: string;
  relevantIssues: string[];
  level: 'local' | 'state' | 'federal';
}

export interface AppState {
  currentStep: number;
  userProfile: UserProfile;
  starredCandidates: string[];
  starredMeasures: string[];
  feedback: string;
  finalScreenType: 'cast' | 'thankyou' | null;
}
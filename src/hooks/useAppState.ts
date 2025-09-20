import { useState, useEffect } from 'react';
import { AppState, UserProfile } from '@/types';

const STORAGE_KEY = 'flint-app-state';

const initialState: AppState = {
  currentStep: 1,
  userProfile: {
    selectedIssues: [],
    ageGroup: '',
    communityRole: [],
    zipCode: ''
  },
  starredCandidates: [],
  starredMeasures: [],
  feedback: '',
  finalScreenType: null
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));
  };

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const toggleStarredCandidate = (candidateId: string) => {
    setState(prev => ({
      ...prev,
      starredCandidates: prev.starredCandidates.includes(candidateId)
        ? prev.starredCandidates.filter(id => id !== candidateId)
        : [...prev.starredCandidates, candidateId]
    }));
  };

  const toggleStarredMeasure = (measureId: string) => {
    setState(prev => ({
      ...prev,
      starredMeasures: prev.starredMeasures.includes(measureId)
        ? prev.starredMeasures.filter(id => id !== measureId)
        : [...prev.starredMeasures, measureId]
    }));
  };

  const setFeedback = (feedback: string) => {
    setState(prev => ({ ...prev, feedback }));
  };

  const setFinalScreenType = (type: 'cast' | 'thankyou' | null) => {
    setState(prev => ({ ...prev, finalScreenType: type }));
  };

  const resetState = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    state,
    updateUserProfile,
    setCurrentStep,
    toggleStarredCandidate,
    toggleStarredMeasure,
    setFeedback,
    setFinalScreenType,
    resetState
  };
};
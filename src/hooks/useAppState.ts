import { useState, useEffect, useCallback } from 'react';
import { AppState, UserProfile, Issue } from '@/types';
import { apiClient } from '@/lib/api';

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
  finalScreenType: null,
  // New issue management state
  issues: [],
  issuesLoading: false,
  issuesError: null,
  // Email and readiness response tracking
  userEmail: '',
  emailOptIn: false,
  readinessResponse: null
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  // New issue management functions using useCallback for stable references
  const loadIssues = useCallback(async (retryCount = 0) => {
    const maxRetries = 2;
    console.log('🔄 Loading issues from backend...' + (retryCount > 0 ? ` (retry ${retryCount}/${maxRetries})` : ''));
    setState(prev => ({ ...prev, issuesLoading: true, issuesError: null }));

    try {
      const response = await apiClient.getIssues();

      if (response.success) {
        console.log('✅ Issues loaded successfully:', response.data.issues.length, 'issues');
        setState(prev => ({
          ...prev,
          issues: response.data.issues,
          issuesLoading: false,
          issuesError: null
        }));
      } else {
        throw new Error(response.error || 'Failed to load issues');
      }
    } catch (error) {
      console.error('❌ Error loading issues:', error);

      // Auto-retry logic for network errors
      if (retryCount < maxRetries && (
        error instanceof Error && (
          error.message.includes('fetch') ||
          error.message.includes('network') ||
          error.message.includes('timeout') ||
          error.message.includes('Failed to load issues')
        )
      )) {
        console.log(`🔄 Auto-retrying in 2 seconds... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          loadIssues(retryCount + 1);
        }, 2000);
        return;
      }

      // Final error state
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const userFriendlyError = errorMessage.includes('Failed to fetch')
        ? 'Unable to connect to server. Please check your internet connection and make sure the backend is running on port 5001.'
        : errorMessage;

      setState(prev => ({
        ...prev,
        issuesLoading: false,
        issuesError: userFriendlyError
      }));
    }
  }, []);

  const refreshIssues = useCallback(() => {
    console.log('🔄 Refreshing issues from backend...');
    loadIssues();
  }, [loadIssues]);

  // Defensive loading - ensure issues are available when needed
  const ensureIssuesLoaded = useCallback(async () => {
    if (state.issues.length === 0 && !state.issuesLoading && !state.issuesError) {
      console.log('🛡️ Defensive loading: Issues not loaded, triggering load...');
      await loadIssues();
    }
  }, [state.issues.length, state.issuesLoading, state.issuesError, loadIssues]);

  // Load state from localStorage on mount and fetch issues
  useEffect(() => {
    let isComponentMounted = true;

    const initializeApp = async () => {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // Merge saved state but always refresh issues from backend
          if (isComponentMounted) {
            setState({
              ...parsed,
              issues: [], // Reset issues to force fresh load
              issuesLoading: false,
              issuesError: null
            });
          }
        } catch (error) {
          console.error('Failed to parse saved state:', error);
        }
      }

      // Always load fresh issue data from backend on app start
      if (isComponentMounted) {
        await loadIssues();
      }
    };

    initializeApp();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isComponentMounted = false;
    };
  }, [loadIssues]);

  // Defensive loading when navigating to issue selection screen (step 2)
  useEffect(() => {
    if (state.currentStep === 2) {
      ensureIssuesLoaded();
    }
  }, [state.currentStep, ensureIssuesLoaded]);

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

  const setUserEmail = (email: string) => {
    setState(prev => ({ ...prev, userEmail: email }));
  };

  const setEmailOptIn = (optIn: boolean) => {
    setState(prev => ({ ...prev, emailOptIn: optIn }));
  };

  const setReadinessResponse = (response: 'yes' | 'no' | 'still-thinking' | null) => {
    setState(prev => ({ ...prev, readinessResponse: response }));
  };

  return {
    state,
    updateUserProfile,
    setCurrentStep,
    toggleStarredCandidate,
    toggleStarredMeasure,
    setFeedback,
    setFinalScreenType,
    resetState,
    // New issue management functions
    loadIssues,
    refreshIssues,
    ensureIssuesLoaded,
    // Email and readiness response functions
    setUserEmail,
    setEmailOptIn,
    setReadinessResponse
  };
};
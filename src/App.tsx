import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppState } from "@/hooks/useAppState";

// Import screens
import { WelcomeScreen } from "@/screens/WelcomeScreen";
import { IssueSelectionScreen } from "@/screens/IssueSelectionScreen";
import { DemographicsScreen } from "@/screens/DemographicsScreen";
import { SocialProofScreen } from "@/screens/SocialProofScreen";
import { OfficeMappingScreen } from "@/screens/OfficeMappingScreen";
import { CandidatesScreen } from "@/screens/CandidatesScreen";
import { BallotPreviewScreen } from "@/screens/BallotPreviewScreen";
import { ReadyToCastScreen } from "@/screens/ReadyToCastScreen";
import { FeedbackScreen } from "@/screens/FeedbackScreen";
import { ThankYouScreen } from "@/screens/ThankYouScreen";
import { CastItScreen } from "@/screens/CastItScreen";

const queryClient = new QueryClient();

const App = () => {
  const {
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
    refreshIssues
  } = useAppState();

  const handleNextStep = () => {
    const nextStep = state.currentStep + 1;
    window.history.pushState({ step: nextStep }, '', '');
    setCurrentStep(nextStep);
  };

  const handleSelectIssues = (issues: string[]) => {
    updateUserProfile({ selectedIssues: issues });
  };

  const handleRestartApp = () => {
    resetState();
  };

  const handleReadyYes = () => {
    setFinalScreenType('cast');
    window.history.pushState({ step: 10 }, '', '');
    setCurrentStep(10); // Go to CastItScreen
  };

  const handleNotReady = () => {
    window.history.pushState({ step: 9 }, '', '');
    setCurrentStep(9); // Go to FeedbackScreen
  };

  const handleFeedbackDone = (feedback: string) => {
    setFeedback(feedback);
    setFinalScreenType('thankyou');
    window.history.pushState({ step: 10 }, '', '');
    setCurrentStep(10); // Go to ThankYouScreen
  };

  // Check for reset parameter on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      console.log('🔄 Reset parameter detected, clearing app state...');
      resetState();
      // Clean up the URL by removing the reset parameter
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, [resetState]);

  // Scroll to top whenever the current step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.currentStep]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setCurrentStep(event.state.step);
      } else if (state.currentStep > 1) {
        // Fallback: go back one step if no state
        setCurrentStep(state.currentStep - 1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [state.currentStep]);

  const renderCurrentScreen = () => {
    switch (state.currentStep) {
      case 1:
        return <WelcomeScreen onContinue={handleNextStep} />;
      
      case 2:
        return (
          <IssueSelectionScreen
            selectedIssues={state.userProfile.selectedIssues}
            onIssuesChange={handleSelectIssues}
            onContinue={handleNextStep}
            // New backend-driven issue props
            issues={state.issues}
            issuesLoading={state.issuesLoading}
            issuesError={state.issuesError}
            onRefreshIssues={refreshIssues}
          />
        );
      
      case 3:
        return (
          <DemographicsScreen
            userProfile={state.userProfile}
            onProfileUpdate={updateUserProfile}
            onContinue={handleNextStep}
          />
        );
      
      case 4:
        return (
          <SocialProofScreen
            selectedIssues={state.userProfile.selectedIssues}
            zipCode={state.userProfile.zipCode}
            onContinue={handleNextStep}
            issues={state.issues}
          />
        );
      
      case 5:
        return (
          <OfficeMappingScreen
            selectedIssues={state.userProfile.selectedIssues}
            onContinue={handleNextStep}
            issues={state.issues}
          />
        );
      
      case 6:
        return (
          <CandidatesScreen
            selectedIssues={state.userProfile.selectedIssues}
            starredCandidates={state.starredCandidates}
            starredMeasures={state.starredMeasures}
            onToggleStarredCandidate={toggleStarredCandidate}
            onToggleStarredMeasure={toggleStarredMeasure}
            onContinue={handleNextStep}
            issues={state.issues}
          />
        );
      
      case 7:
        return (
          <BallotPreviewScreen
            starredCandidates={state.starredCandidates}
            starredMeasures={state.starredMeasures}
            zipCode={state.userProfile.zipCode}
            onContinue={handleNextStep}
            onRestart={handleRestartApp}
          />
        );
      
      case 8:
        return (
          <ReadyToCastScreen
            onYes={handleReadyYes}
            onNotReady={handleNotReady}
          />
        );
      
      case 9:
        return (
          <FeedbackScreen
            onDone={handleFeedbackDone}
          />
        );
      
      case 10:
        if (state.finalScreenType === 'thankyou') {
          return (
            <ThankYouScreen
              onRestart={handleRestartApp}
            />
          );
        } else {
          return (
            <CastItScreen
              zipCode={state.userProfile.zipCode}
              onRestart={handleRestartApp}
            />
          );
        }
      
      default:
        return <WelcomeScreen onContinue={handleNextStep} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {renderCurrentScreen()}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
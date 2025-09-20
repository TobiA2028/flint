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
import { CastItScreen } from "@/screens/CastItScreen";

const queryClient = new QueryClient();

const App = () => {
  const {
    state,
    updateUserProfile,
    setCurrentStep,
    toggleStarredCandidate,
    toggleStarredMeasure,
    resetState
  } = useAppState();

  const handleNextStep = () => {
    setCurrentStep(state.currentStep + 1);
  };

  const handleSelectIssues = (issues: string[]) => {
    updateUserProfile({ selectedIssues: issues });
  };

  const handleRestartApp = () => {
    resetState();
  };

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
          />
        );
      
      case 5:
        return (
          <OfficeMappingScreen
            selectedIssues={state.userProfile.selectedIssues}
            onContinue={handleNextStep}
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
          <CastItScreen
            zipCode={state.userProfile.zipCode}
            onRestart={handleRestartApp}
          />
        );
      
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
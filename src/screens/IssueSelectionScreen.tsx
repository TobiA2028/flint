import { useState } from 'react';
import { IssueCard } from '@/components/IssueCard';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { ArrowRight, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { SparkHeader } from '@/components/SparkHeader';
import { apiClient, generateSessionId } from '@/lib/api';
import { Issue } from '@/types';

interface IssueSelectionScreenProps {
  selectedIssues: string[];
  onIssuesChange: (issues: string[]) => void;
  onContinue: () => void;
  // New props for backend-driven issues
  issues: Issue[];
  issuesLoading: boolean;
  issuesError: string | null;
  onRefreshIssues: () => void;
}

export const IssueSelectionScreen = ({
  selectedIssues,
  onIssuesChange,
  onContinue,
  issues,
  issuesLoading,
  issuesError,
  onRefreshIssues
}: IssueSelectionScreenProps) => {
  const maxSelections = 3;
  const canContinue = selectedIssues.length === maxSelections;

  // ========================================================================
  // API INTEGRATION STATE
  // ========================================================================

  /**
   * Loading state for API calls
   *
   * This tracks when we're submitting data to the backend,
   * allowing us to show loading indicators and disable buttons.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submission status tracking
   *
   * Tracks the result of the API call so we can show success/error feedback
   * to the user before proceeding to the next screen.
   */
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  /**
   * Error message for failed submissions
   *
   * Stores user-friendly error messages to display when API calls fail.
   */
  const [errorMessage, setErrorMessage] = useState<string>('');

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleIssueSelect = (issueId: string) => {
    // Reset submission status when user changes selection
    if (submissionStatus !== 'idle') {
      setSubmissionStatus('idle');
      setErrorMessage('');
    }

    if (selectedIssues.includes(issueId)) {
      onIssuesChange(selectedIssues.filter(id => id !== issueId));
    } else if (selectedIssues.length < maxSelections) {
      onIssuesChange([...selectedIssues, issueId]);
    }
  };

  /**
   * Enhanced continue handler with backend integration
   *
   * This function now:
   * 1. Generates a session ID for the user
   * 2. Calls the backend API to increment issue counts
   * 3. Provides user feedback during the process
   * 4. Handles success and error scenarios gracefully
   *
   * Learning objectives:
   * - Understand async/await patterns in React event handlers
   * - Learn how to provide user feedback during API calls
   * - Practice error handling and recovery patterns
   * - See how to integrate frontend state with backend APIs
   */
  const handleContinue = async () => {
    // TODO: Learn about these validation patterns
    if (!canContinue || isSubmitting) {
      return; // Prevent multiple submissions or invalid submissions
    }

    // Start the submission process
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setErrorMessage('');

    try {
      console.log('🚀 Starting issue submission process...');

      // TODO: Session Management Learning
      // Generate a unique session ID for this user
      // In a production app, you might:
      // - Use browser fingerprinting
      // - Generate this server-side
      // - Use more sophisticated user identification
      const sessionId = generateSessionId();
      console.log('📝 Generated session ID:', sessionId);

      // TODO: Local Storage Learning
      // Store the session ID in localStorage so we can track this user
      // across page reloads and prevent duplicate submissions
      localStorage.setItem('flint-session-id', sessionId);

      // TODO: API Integration Learning
      // Call the backend API to increment issue counts
      // Notice how we're using the structured API client we created
      const response = await apiClient.incrementIssues({
        issueIds: selectedIssues,
        userId: sessionId
      });

      console.log('📊 API Response:', response);

      if (response.success) {
        // TODO: Success Handling Learning
        // Show success feedback to the user
        setSubmissionStatus('success');
        console.log('✅ Successfully submitted issue selections!');

        // Wait a moment to show success feedback, then proceed
        setTimeout(() => {
          onContinue(); // Move to next screen
        }, 1000);

      } else {
        // TODO: Error Handling Learning
        // Handle API errors gracefully
        throw new Error(response.error || 'Failed to submit selections');
      }

    } catch (error) {
      console.error('❌ Error submitting issue selections:', error);

      // TODO: User Experience Learning
      // Set error state to show user-friendly error message
      setSubmissionStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      // TODO: State Management Learning
      // Always clear loading state, regardless of success/failure
      setIsSubmitting(false);
    }
  };

  /**
   * Dynamic mascot message based on selection and submission state
   *
   * This function now considers both the selection state and the
   * API submission state to provide contextual feedback.
   */
  const getMascotMessage = () => {
    // TODO: State-based UI Learning
    // Notice how we're providing different messages based on multiple state variables

    if (submissionStatus === 'success') {
      return "Amazing! Your choices have been recorded. Moving to next step...";
    } else if (submissionStatus === 'error') {
      return "Oops! Something went wrong. Please try again.";
    } else if (isSubmitting) {
      return "Recording your choices with the community...";
    } else if (selectedIssues.length === 0) {
      return "Pick the 3 issues that matter most to you!";
    } else if (selectedIssues.length < maxSelections) {
      return `Great choice! Select ${maxSelections - selectedIssues.length} more.`;
    } else {
      return "Perfect! These issues will guide your civic journey.";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={2} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide
            size="md"
            className="mb-4"
          />

          {/* TODO: Dynamic Mascot Message Display */}
          <div className="mb-6">
            <p className="text-lg font-medium text-foreground">
              {getMascotMessage()}
            </p>
          </div>

          <SparkHeader
            title="What issues matter most to you?"
          />
          
          <p className="text-muted-foreground mb-2">
            Pick exactly <span className="font-semibold text-accent">{maxSelections} challenges</span> that you want Houston to prioritize
          </p>
          
          <div className="flex justify-center items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Selected:</span>
            <span className={`font-semibold ${canContinue ? 'text-success' : 'text-accent'}`}>
              {selectedIssues.length}/{maxSelections}
            </span>
          </div>
        </div>
        
        {/* ================================================================ */}
        {/* DYNAMIC ISSUES LOADING SECTION */}
        {/* ================================================================ */}

        {issuesLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Loading issues from backend...</p>
          </div>
        ) : issuesError ? (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">Failed to Load Issues</p>
              </div>
              <button
                onClick={onRefreshIssues}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
            <p className="text-red-600 text-sm mb-2">{issuesError}</p>
            <p className="text-red-500 text-xs">
              💡 Make sure your backend server is running on port 5001
            </p>
          </div>
        ) : issues.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {issues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssues.includes(issue.id)}
                onSelect={handleIssueSelect}
                disabled={!selectedIssues.includes(issue.id) && selectedIssues.length >= maxSelections}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No issues available</p>
            <button
              onClick={onRefreshIssues}
              className="flex items-center space-x-2 text-accent hover:text-accent-dark"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        )}
        
        {/* ================================================================ */}
        {/* STATUS FEEDBACK SECTION */}
        {/* ================================================================ */}

        {/* Error Message Display */}
        {submissionStatus === 'error' && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Submission Failed</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
            <p className="text-red-500 text-xs mt-2">
              💡 Make sure your backend server is running on port 5000
            </p>
          </div>
        )}

        {/* Success Message Display */}
        {submissionStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">Success!</p>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Your issue selections have been recorded with the community.
            </p>
          </div>
        )}

        {/* ================================================================ */}
        {/* ENHANCED CONTINUE BUTTON */}
        {/* ================================================================ */}

        <div className="flex justify-center">
          <CTAButton
            onClick={handleContinue}  // TODO: Notice we changed from onContinue to handleContinue
            disabled={!canContinue || isSubmitting}  // TODO: Disable during submission
            variant={submissionStatus === 'success' ? 'secondary' : 'spark'}
            className="min-w-[200px]"
          >
            {/* TODO: Dynamic Button Content Learning */}
            {/* Notice how the button content changes based on the current state */}

            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : submissionStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Success!
              </>
            ) : submissionStatus === 'error' ? (
              <>
                Try Again
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
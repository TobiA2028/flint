import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { apiClient } from '@/lib/api';

interface ReadyToCastScreenProps {
  onYes: () => void;
  onNotReady: () => void;
  userProfile: any; // User profile data
  starredCandidates: string[]; // Starred candidate IDs
  starredMeasures: string[]; // Starred measure IDs
}

export const ReadyToCastScreen = ({
  onYes,
  onNotReady,
  userProfile,
  starredCandidates,
  starredMeasures
}: ReadyToCastScreenProps) => {

  const handleResponse = async (response: 'yes' | 'no' | 'still-thinking') => {
    try {
      // Store user completion data with their response
      await apiClient.storeUserCompletion({
        user_profile: userProfile,
        starred_candidates: starredCandidates,
        starred_measures: starredMeasures,
        readiness_response: response,
        session_id: Date.now().toString() // Simple session ID
      });

      console.log(`✅ Stored user response: ${response}`);

      // Continue with original navigation logic
      if (response === 'yes') {
        onYes();
      } else {
        onNotReady();
      }
    } catch (error) {
      console.error('❌ Error storing user completion:', error);
      // Still continue with navigation even if storage fails
      if (response === 'yes') {
        onYes();
      } else {
        onNotReady();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={8} totalSteps={10} />
        
        <div className="text-center mb-12">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Are you ready to cast your vote?
          </h1>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <CTAButton
            onClick={() => handleResponse('yes')}
            variant="spark"
            className="w-full"
          >
            Yes
          </CTAButton>

          <CTAButton
            onClick={() => handleResponse('no')}
            variant="secondary"
            className="w-full"
          >
            No
          </CTAButton>

          <CTAButton
            onClick={() => handleResponse('still-thinking')}
            variant="secondary"
            className="w-full"
          >
            Still Thinking
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
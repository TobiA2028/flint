import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';

interface ReadyToCastScreenProps {
  onYes: () => void;
  onNotReady: () => void;
}

export const ReadyToCastScreen = ({ onYes, onNotReady }: ReadyToCastScreenProps) => {
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
            onClick={onYes}
            variant="spark"
            className="w-full"
          >
            Yes
          </CTAButton>
          
          <CTAButton
            onClick={onNotReady}
            variant="secondary"
            className="w-full"
          >
            No
          </CTAButton>
          
          <CTAButton
            onClick={onNotReady}
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
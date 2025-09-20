import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackScreenProps {
  onDone: (feedback: string) => void;
}

export const FeedbackScreen = ({ onDone }: FeedbackScreenProps) => {
  const [feedback, setFeedback] = useState('');

  const handleDone = () => {
    onDone(feedback);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={9} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Don't be shy, share why
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Let us know what's stopping you
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts or concerns..."
            className="min-h-[120px] resize-none"
          />
          
          <CTAButton
            onClick={handleDone}
            variant="spark"
            className="w-full"
          >
            Done
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
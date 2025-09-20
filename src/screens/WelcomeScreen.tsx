import { CTAButton } from '@/components/CTAButton';
import { MascotGuide } from '@/components/MascotGuide';
import { SparkHeader } from '@/components/SparkHeader';
import { Flame } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Mascot */}
        <MascotGuide 
          size="lg"
        />
        
        {/* Hero Content */}
        <SparkHeader
          title="Ready to spark change in your community?"
          subtitle="Flint helps you connect the issues you care about to the local elections that shape them. Let's build your personal voting guide together."
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          <div className="p-6 bg-card rounded-2xl border shadow-sm">
            <div className="text-2xl font-bold text-civic mb-2">Local Impact</div>
            <p className="text-muted-foreground">Your local vote has 100x more impact than federal elections</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border shadow-sm">
            <div className="text-2xl font-bold text-spark mb-2">Your Voice</div>
            <p className="text-muted-foreground">Connect your values to candidates who share them</p>
          </div>
        </div>
        
        {/* CTA */}
        <CTAButton 
          onClick={onContinue}
          variant="spark"
          className="w-full"
        >
          <Flame className="w-5 h-5 mr-2" />
          Let's Spark It
        </CTAButton>
      </div>
    </div>
  );
};
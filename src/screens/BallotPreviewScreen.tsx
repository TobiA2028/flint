import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, MapPin, Calendar, Share, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

interface BallotPreviewScreenProps {
  starredCandidates: string[];
  starredMeasures: string[];
  zipCode: string;
  onContinue: () => void;
  onRestart: () => void;
}

const mockStarredCandidates = [
  { id: 'candidate-1', name: 'Sarah Chen', office: 'City Council District 3', party: 'Democratic' },
  { id: 'candidate-3', name: 'Elena Rodriguez', office: 'Mayor', party: 'Independent' }
];

const mockStarredMeasures = [
  { id: 'measure-1', title: 'School Bond Initiative - Measure A', category: 'Education' }
];

export const BallotPreviewScreen = ({ 
  starredCandidates, 
  starredMeasures, 
  zipCode,
  onContinue,
  onRestart 
}: BallotPreviewScreenProps) => {
  const [email, setEmail] = useState('');
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasStarredItems = starredCandidates.length > 0 || starredMeasures.length > 0;
  const canSubmitEmail = email.includes('@') && email.length > 5;

  const handleEmailSubmit = async () => {
    if (!canSubmitEmail) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Ballot preview sent to your email!');
    setIsSubmitting(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Flint Ballot Preview',
        text: 'Check out my personalized ballot preview from Flint!',
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <ProgressIndicator currentStep={7} totalSteps={7} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your ballot preview
          </h1>
          
          <p className="text-muted-foreground">
            Save this guide and use it when you vote
          </p>
        </div>

        {hasStarredItems ? (
          <div className="space-y-8">
            {/* Ballot Summary */}
            <Card className="p-6 shadow-card print:shadow-none">
              <div className="flex items-center justify-between mb-4 print:mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Your Selections
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>ZIP: {zipCode}</span>
                </div>
              </div>
              
              {/* Candidates */}
              {mockStarredCandidates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-card-foreground mb-4">
                    Candidates
                  </h3>
                  <div className="space-y-3">
                    {mockStarredCandidates.map(candidate => (
                      <div key={candidate.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.office}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {candidate.party}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ballot Measures */}
              {mockStarredMeasures.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-card-foreground mb-4">
                    Ballot Measures
                  </h3>
                  <div className="space-y-3">
                    {mockStarredMeasures.map(measure => (
                      <div key={measure.id} className="p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-card-foreground">
                              {measure.title}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {measure.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>


            {/* Action Buttons */}
            <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            variant="civic"
            className="min-w-[200px]"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
          </div>
        ) : (
          <Card className="p-8 text-center shadow-card">
            <p className="text-muted-foreground mb-6">
              You haven't starred any candidates or measures yet.
            </p>
            <CTAButton
              onClick={() => window.history.back()}
              variant="civic"
            >
              Go Back to Make Selections
            </CTAButton>
          </Card>
        )}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { SparkHeader } from '@/components/SparkHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Mail, Share, RefreshCw, Calendar, MapPin, Vote, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CastItScreenProps {
  zipCode: string;
  onRestart: () => void;
}

export const CastItScreen = ({ zipCode, onRestart }: CastItScreenProps) => {
  const [email, setEmail] = useState('');
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmitEmail = email.includes('@') && email.length > 5;

  const handleEmailSubmit = async () => {
    if (!canSubmitEmail) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Results saved and sent to your email!');
    setIsSubmitting(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Flint Voting Guide',
        text: 'I just created my personalized voting guide with Flint!',
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
        <ProgressIndicator currentStep={8} totalSteps={8} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <SparkHeader
            title="Let's cast it!"
            subtitle="You're all set! Here's everything you need to make your voice heard."
          />
        </div>

        <div className="space-y-8">
          {/* Next Steps */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center space-x-2 mb-4">
              <Vote className="w-6 h-6 text-civic" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Next Steps
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-civic/5 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-civic" />
                  <span className="font-medium text-card-foreground">Election Date</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  November 5, 2024
                </p>
                <p className="text-xs text-muted-foreground">
                  Polls are open 7 AM - 8 PM
                </p>
              </div>
              
              <div className="bg-accent/5 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-medium text-card-foreground">Find Your Polling Place</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  ZIP: {zipCode}
                </p>
                <button className="text-sm text-accent hover:text-accent/80">
                  Get directions →
                </button>
              </div>
            </div>

            <div className="bg-spark/5 p-4 rounded-lg border border-spark/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-spark mt-0.5" />
                <div>
                  <p className="font-medium text-card-foreground mb-1">
                    Bring your voting guide
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Take a screenshot or print your ballot preview to reference while voting.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Your Results */}
          <Card className="p-6 shadow-card print:hidden">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Save your results
            </h3>
            
            <p className="text-muted-foreground mb-4">
              Get a record of your candidates and ballot measures along with a voting guide, poll locations, and other resources straight to your email. 
            </p>
            
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3"
                />
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={wantsUpdates}
                    onCheckedChange={(checked) => setWantsUpdates(checked as boolean)}
                  />
                  <label htmlFor="updates" className="text-sm text-muted-foreground">
                    I would like to receive updates about future elections and civic engagement opportunities.
                  </label>
                </div>
              </div>
              
              <CTAButton
                onClick={handleEmailSubmit}
                disabled={!canSubmitEmail || isSubmitting}
                variant="civic"
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Email my voting guide
                  </>
                )}
              </CTAButton>
            </div>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
            <CTAButton
              onClick={handlePrint}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Print Guide
            </CTAButton>
            
            <CTAButton
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Flint
            </CTAButton>
            
            <CTAButton
              onClick={onRestart}
              variant="spark"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};
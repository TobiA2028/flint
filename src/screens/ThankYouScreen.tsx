import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Share, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface ThankYouScreenProps {
  onRestart: () => void;
  userProfile?: any; // Optional user profile data to include with signup
}

export const ThankYouScreen = ({ onRestart, userProfile }: ThankYouScreenProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Flint - Civic Engagement Made Easy',
        text: 'Check out Flint - it helps you navigate the voting process with personalized recommendations!',
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.includes('@') || email.length < 5) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store email signup via API
      const response = await apiClient.storeEmailSignup({
        email,
        source: 'thankyou',
        wants_updates: true, // ThankYou screen implies they want updates
        user_profile: userProfile,
        session_id: Date.now().toString() // Simple session ID
      });

      if (response.success) {
        toast.success('Thank you! We\'ll keep you updated on civic engagement opportunities.');
        setEmail('');
      } else {
        toast.error('There was an issue saving your email. Please try again.');
        console.error('Email signup failed:', response.error);
      }
    } catch (error) {
      toast.error('Unable to save email. Please check your connection.');
      console.error('Email signup error:', error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={10} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Thank you for sharing!
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Your feedback helps us make civic engagement easier for everyone.
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          {/* Share Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Help others get involved
            </h3>
            <CTAButton
              onClick={handleShare}
              variant="secondary"
              className="w-full"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Flint with Others
            </CTAButton>
          </Card>

          {/* Email Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Stay engaged
            </h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CTAButton
                onClick={handleEmailSubmit}
                variant="spark"
                className="w-full"
                disabled={isSubmitting}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Subscribing...' : 'Get Civic Updates'}
              </CTAButton>
            </div>
          </Card>

          {/* Restart Option */}
          <CTAButton
            onClick={onRestart}
            variant="secondary"
            className="w-full"
          >
            Start Over
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
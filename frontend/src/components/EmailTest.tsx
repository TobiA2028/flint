import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { sendVotingGuideEmail, sendFollowUpEmail, isEmailJSConfigured, getEmailJSStatus } from '@/lib/emailService';

export const EmailTest = () => {
  const [email, setEmail] = useState('');
  const [isTestingVotingGuide, setIsTestingVotingGuide] = useState(false);
  const [isTestingFollowUp, setIsTestingFollowUp] = useState(false);

  const emailJSStatus = getEmailJSStatus();

  const testVotingGuideEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsTestingVotingGuide(true);

    try {
      console.log('🧪 Testing voting guide email...', { email });

      const testUserProfile = {
        zipCode: '12345',
        selectedIssues: ['housing', 'education'],
        ageGroup: '25-34',
        communityRole: ['voter']
      };

      const testCandidates = [
        {
          id: 'test-candidate-1',
          name: 'Test Candidate',
          party: 'Independent',
          photo: '',
          positions: ['Supports affordable housing', 'Education reform advocate'],
          office_id: 'mayor',
          related_issues: ['housing', 'education'],
          isStarred: true
        }
      ];

      const testMeasures = [
        {
          id: 'test-measure-1',
          title: 'Education Funding Initiative',
          description: 'Increase funding for local schools',
          category: 'Education',
          impact: 'Will improve school resources',
          related_issues: ['education'],
          isStarred: true
        }
      ];

      const result = await sendVotingGuideEmail(
        email,
        testUserProfile,
        testCandidates,
        testMeasures
      );

      if (result.success) {
        toast.success('Test voting guide email sent successfully! Check your inbox.');
        console.log('✅ Test voting guide email sent');
      } else {
        toast.error(`Failed to send test email: ${result.error}`);
        console.error('❌ Test email failed:', result.error);
      }
    } catch (error) {
      toast.error('Error testing email');
      console.error('❌ Test email error:', error);
    }

    setIsTestingVotingGuide(false);
  };

  const testFollowUpEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsTestingFollowUp(true);

    try {
      console.log('🧪 Testing follow-up email...', { email });

      const result = await sendFollowUpEmail(email);

      if (result.success) {
        toast.success('Test follow-up email sent successfully! Check your inbox.');
        console.log('✅ Test follow-up email sent');
      } else {
        toast.error(`Failed to send test email: ${result.error}`);
        console.error('❌ Test email failed:', result.error);
      }
    } catch (error) {
      toast.error('Error testing email');
      console.error('❌ Test email error:', error);
    }

    setIsTestingFollowUp(false);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Testing
        </h3>

        {/* EmailJS Configuration Status */}
        <div className="mb-4 p-3 rounded-lg bg-gray-50">
          <div className="text-sm font-medium mb-2">EmailJS Configuration:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              {emailJSStatus.configured ?
                <CheckCircle className="w-3 h-3 text-green-500" /> :
                <AlertCircle className="w-3 h-3 text-red-500" />
              }
              <span>Overall: {emailJSStatus.configured ? 'Configured' : 'Not Configured'}</span>
            </div>
            <div className="flex items-center gap-2">
              {emailJSStatus.serviceId ?
                <CheckCircle className="w-3 h-3 text-green-500" /> :
                <AlertCircle className="w-3 h-3 text-red-500" />
              }
              <span>Service ID: {emailJSStatus.serviceId ? 'Set' : 'Missing'}</span>
            </div>
            <div className="flex items-center gap-2">
              {emailJSStatus.templateId ?
                <CheckCircle className="w-3 h-3 text-green-500" /> :
                <AlertCircle className="w-3 h-3 text-red-500" />
              }
              <span>Template ID: {emailJSStatus.templateId ? 'Set' : 'Missing'}</span>
            </div>
            <div className="flex items-center gap-2">
              {emailJSStatus.publicKey ?
                <CheckCircle className="w-3 h-3 text-green-500" /> :
                <AlertCircle className="w-3 h-3 text-red-500" />
              }
              <span>Public Key: {emailJSStatus.publicKey ? 'Set' : 'Missing'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email to test"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-2">
          <CTAButton
            onClick={testVotingGuideEmail}
            disabled={!email || isTestingVotingGuide}
            variant="spark"
            className="w-full"
          >
            {isTestingVotingGuide ? 'Sending...' : 'Test Voting Guide Email'}
          </CTAButton>

          <CTAButton
            onClick={testFollowUpEmail}
            disabled={!email || isTestingFollowUp}
            variant="secondary"
            className="w-full"
          >
            {isTestingFollowUp ? 'Sending...' : 'Test Follow-up Email'}
          </CTAButton>
        </div>

        <div className="text-xs text-gray-600">
          <p>• Check browser console for detailed logs</p>
          <p>• Check your email inbox and spam folder</p>
          <p>• Check EmailJS dashboard logs</p>
        </div>
      </div>
    </Card>
  );
};
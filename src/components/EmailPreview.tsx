import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CTAButton } from '@/components/CTAButton';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, Download, MapPin, Calendar, Vote } from 'lucide-react';
import { Candidate, BallotMeasure } from '@/types';
import { generateVotingGuideEmail, EmailTemplateData } from '@/lib/emailService';

interface EmailPreviewProps {
  userProfile: EmailTemplateData['userProfile'];
  starredCandidates: Candidate[];
  starredMeasures: BallotMeasure[];
  userEmail: string;
}

export const EmailPreview = ({
  userProfile,
  starredCandidates,
  starredMeasures,
  userEmail
}: EmailPreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const generateEmailContent = () => {
    // Use the shared template generator to ensure preview matches real emails
    return generateVotingGuideEmail({
      userProfile,
      starredCandidates,
      starredMeasures,
      userEmail
    });
  };

  const emailContent = generateEmailContent();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Email Preview</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <CTAButton
            onClick={() => setShowPreview(!showPreview)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Email Preview'}
          </CTAButton>

          <CTAButton
            onClick={() => copyToClipboard(emailContent.htmlContent)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Copy HTML
          </CTAButton>
        </div>

        {showPreview && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 border-b">
              <div className="text-sm text-gray-600">
                <strong>To:</strong> {userEmail}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Subject:</strong> {emailContent.subject}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <iframe
                srcDoc={emailContent.htmlContent}
                className="w-full h-96 border-0"
                title="Email Preview"
              />
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Recipients:</strong> Users who complete the voting guide</p>
          <p><strong>Content includes:</strong> Selected candidates, ballot measures, voting dates, polling info</p>
        </div>
      </div>
    </Card>
  );
};
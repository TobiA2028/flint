import { useState, useEffect } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailPreview } from '@/components/EmailPreview';
import { EmailTest } from '@/components/EmailTest';
import { Database, Mail, RefreshCw, Eye, Users } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DebugScreenProps {
  onBack: () => void;
}

export const DebugScreen = ({ onBack }: DebugScreenProps) => {
  const [emails, setEmails] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [readinessStats, setReadinessStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedCompletion, setSelectedCompletion] = useState<any>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      // Fetch stored emails
      const emailResponse = await fetch('http://localhost:5001/api/debug/emails');
      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        setEmails(emailData.emails || []);
      }

      // Fetch user completions
      const completionResponse = await fetch('http://localhost:5001/api/debug/completions');
      if (completionResponse.ok) {
        const completionData = await completionResponse.json();
        setCompletions(completionData.completions || []);
      }

      // Fetch readiness stats
      const statsResponse = await fetch('http://localhost:5001/api/readiness-stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setReadinessStats(statsData.stats || {});
      }

    } catch (error) {
      console.error('Error fetching debug data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  const mockCandidatesAndMeasures = {
    candidates: [
      {
        id: 'candidate-1',
        name: 'Sarah Chen',
        party: 'Democratic',
        office_id: 'City Council',
        positions: ['Supports affordable housing initiatives', 'Advocates for public education funding']
      }
    ],
    measures: [
      {
        id: 'measure-1',
        title: 'School Bond Initiative - Measure A',
        category: 'Education',
        description: 'Authorizes $500 million in bonds to modernize school facilities'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Debug Dashboard</h1>
            <p className="text-muted-foreground">Test email storage and preview email drafts</p>
          </div>
          <div className="flex gap-2">
            <CTAButton
              onClick={fetchDebugData}
              variant="secondary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </CTAButton>
            <CTAButton onClick={onBack} variant="spark">
              Back to App
            </CTAButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Data Views */}
          <div className="space-y-6">
            {/* Readiness Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Readiness Responses</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Yes, ready to vote:</span>
                  <Badge variant="default">{readinessStats.yes || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>No, not ready:</span>
                  <Badge variant="secondary">{readinessStats.no || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Still thinking:</span>
                  <Badge variant="outline">{readinessStats['still-thinking'] || 0}</Badge>
                </div>
              </div>
            </Card>

            {/* Stored Emails */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Stored Email Signups ({emails.length})</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {emails.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No email signups yet. Complete the app flow to test!</p>
                ) : (
                  emails.map((email, index) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <strong>{email.email}</strong>
                        <Badge variant={email.source === 'cast' ? 'default' : 'secondary'}>
                          {email.source}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        Updates: {email.wants_updates ? 'Yes' : 'No'} •
                        {new Date(email.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Email Testing */}
            <EmailTest />

            {/* User Completions */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">User Completions ({completions.length})</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {completions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No completions yet. Go through the ReadyToCast screen to test!</p>
                ) : (
                  completions.map((completion, index) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <strong>Response: {completion.readiness_response}</strong>
                          <div className="text-muted-foreground">
                            Issues: {completion.user_profile?.selectedIssues?.join(', ') || 'None'}
                          </div>
                        </div>
                        <CTAButton
                          onClick={() => setSelectedCompletion(completion)}
                          variant="secondary"
                          className="text-xs py-1 px-2 h-auto"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview Email
                        </CTAButton>
                      </div>
                      <div className="text-muted-foreground">
                        Candidates: {completion.starred_candidates?.length || 0} •
                        Measures: {completion.starred_measures?.length || 0} •
                        {new Date(completion.completed_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Email Preview */}
          <div>
            {selectedCompletion ? (
              <EmailPreview
                userProfile={selectedCompletion.user_profile}
                starredCandidates={mockCandidatesAndMeasures.candidates}
                starredMeasures={mockCandidatesAndMeasures.measures}
                userEmail={selectedCompletion.user_profile?.email || 'user@example.com'}
              />
            ) : (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Email Preview</h3>
                  <p>Select a user completion from the left to preview what their email would look like.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Test Section */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Testing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-medium mb-2">Test Email Storage</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Complete the app flow and submit an email on the ThankYou or Cast screens
              </p>
              <CTAButton onClick={onBack} variant="secondary" className="w-full">
                Go to App
              </CTAButton>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Test Readiness Tracking</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Go through to the "Ready to Cast" screen and try different responses
              </p>
              <CTAButton onClick={onBack} variant="secondary" className="w-full">
                Test Responses
              </CTAButton>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Test API Directly</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Open browser console and check network requests to the backend
              </p>
              <CTAButton
                onClick={() => window.open('http://localhost:5001/api/debug/emails', '_blank')}
                variant="secondary"
                className="w-full"
              >
                View Raw API
              </CTAButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
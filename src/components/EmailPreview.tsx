import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CTAButton } from '@/components/CTAButton';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, Download, MapPin, Calendar, Vote } from 'lucide-react';
import { Candidate, BallotMeasure } from '@/types';

interface EmailPreviewProps {
  userProfile: any;
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
    const subject = "Your Personalized Voting Guide from Flint";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Voting Guide</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #64748b;
            font-size: 16px;
        }
        .section {
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .location-info {
            background: #f1f5f9;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .candidate-card, .measure-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
        }
        .candidate-name {
            font-weight: 600;
            font-size: 18px;
            color: #1e293b;
        }
        .candidate-office {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .candidate-party {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        .measure-title {
            font-weight: 600;
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 4px;
        }
        .measure-category {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .voting-info {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 24px;
            border-radius: 8px;
            text-align: center;
        }
        .voting-date {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .voting-hours {
            font-size: 16px;
            opacity: 0.9;
        }
        .footer {
            text-align: center;
            padding-top: 32px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 16px 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Flint</div>
            <div class="subtitle">Your Personalized Voting Guide</div>
        </div>

        <div class="location-info">
            <strong>📍 Your Voting Information</strong><br>
            ZIP Code: ${userProfile.zipCode}<br>
            Selected Issues: ${userProfile.selectedIssues.join(', ')}
        </div>

        ${starredCandidates.length > 0 ? `
        <div class="section">
            <div class="section-title">
                <span>👥</span> Your Selected Candidates
            </div>
            ${starredCandidates.map(candidate => `
                <div class="candidate-card">
                    <div class="candidate-name">${candidate.name}</div>
                    <div class="candidate-office">${candidate.office_id || 'Office'}</div>
                    <span class="candidate-party">${candidate.party}</span>
                    <div style="margin-top: 8px; font-size: 14px; color: #64748b;">
                        ${candidate.positions.slice(0, 2).join(' • ')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${starredMeasures.length > 0 ? `
        <div class="section">
            <div class="section-title">
                <span>🗳️</span> Your Selected Ballot Measures
            </div>
            ${starredMeasures.map(measure => `
                <div class="measure-card">
                    <div class="measure-title">${measure.title}</div>
                    <span class="measure-category">${measure.category}</span>
                    <div style="margin-top: 8px; font-size: 14px; color: #64748b;">
                        ${measure.description}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="voting-info">
            <div class="voting-date">📅 November 5, 2024</div>
            <div class="voting-hours">Polls open 7:00 AM - 8:00 PM</div>
            <a href="#" class="cta-button">Find Your Polling Place</a>
            <a href="#" class="cta-button">Download Voting Guide PDF</a>
        </div>

        <div class="footer">
            <p>This personalized voting guide was created for ${userEmail}</p>
            <p>Generated by Flint - Making civic engagement easier for everyone</p>
            <p><a href="#" style="color: #3b82f6;">Unsubscribe</a> | <a href="#" style="color: #3b82f6;">Share Flint</a></p>
        </div>
    </div>
</body>
</html>
    `;

    return {
      subject,
      htmlContent,
      textContent: `
Your Personalized Voting Guide

Location: ZIP ${userProfile.zipCode}
Selected Issues: ${userProfile.selectedIssues.join(', ')}

CANDIDATES:
${starredCandidates.map(c => `- ${c.name} (${c.party}) for ${c.office_id}`).join('\n')}

BALLOT MEASURES:
${starredMeasures.map(m => `- ${m.title} (${m.category})`).join('\n')}

IMPORTANT DATES:
Election Day: November 5, 2024
Polls open: 7:00 AM - 8:00 PM

Find your polling place and get more voting resources at your local election office.

Generated by Flint for ${userEmail}
      `
    };
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
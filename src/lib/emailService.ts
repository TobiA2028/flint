/**
 * Email Service for Flint Spark Civic Engagement App
 *
 * This module handles real email sending using EmailJS service.
 * It generates personalized voting guide emails and sends them to users.
 */

import emailjs from '@emailjs/browser';
import { Candidate, BallotMeasure } from '@/types';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface EmailContent {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface EmailTemplateData {
  userProfile: {
    zipCode: string;
    selectedIssues: string[];
    ageGroup?: string;
    communityRole?: string[];
    [key: string]: string | string[] | undefined;
  };
  starredCandidates: Candidate[];
  starredMeasures: BallotMeasure[];
  userEmail: string;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * EmailJS Configuration
 *
 * These values should be set in your .env file:
 * VITE_EMAILJS_SERVICE_ID=your_service_id
 * VITE_EMAILJS_TEMPLATE_ID=your_template_id
 * VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */
const EMAILJS_CONFIG: EmailJSConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

// ============================================================================
// EMAIL TEMPLATE GENERATION
// ============================================================================

/**
 * Generate HTML content for voting guide email
 *
 * This reuses the same template logic as EmailPreview.tsx to ensure
 * the preview matches exactly what users receive.
 */
export function generateVotingGuideEmail(data: EmailTemplateData): EmailContent {
  const { userProfile, starredCandidates, starredMeasures, userEmail } = data;

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
        .sample-ballot-card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .ballot-header {
            background: #f8fafc;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ballot-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
        }
        .ballot-location {
            color: #64748b;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .ballot-section {
            padding: 20px;
            border-bottom: 1px solid #f1f5f9;
        }
        .ballot-section:last-child {
            border-bottom: none;
        }
        .ballot-section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .ballot-items {
            space-y: 12px;
        }
        .ballot-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .ballot-item-main {
            flex: 1;
        }
        .candidate-name, .measure-title {
            font-weight: 600;
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 4px;
        }
        .candidate-office {
            color: #64748b;
            font-size: 14px;
        }
        .candidate-party {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
        }
        .measure-category {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
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
        .voting-resources {
            text-align: center;
        }
        .resource-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .cta-button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 8px 4px;
            transition: background-color 0.2s ease;
        }
        .cta-button:hover {
            background: #2563eb;
        }
        .secondary-button {
            background: #6b7280;
        }
        .secondary-button:hover {
            background: #4b5563;
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
            <strong>📍 Your Primary Issues:</strong><br>
           ${userProfile.selectedIssues.join(', ')}
        </div>

        ${(starredCandidates.length > 0 || starredMeasures.length > 0) ? `
        <div class="section">
            <div class="section-title">
                <span>📋</span> Your Sample Ballot
            </div>
            <div class="sample-ballot-card">
                <div class="ballot-header">
                    <div class="ballot-title">Your Selections</div>
                    <div class="ballot-location">
                        <span>📍 ZIP: ${userProfile.zipCode}</span>
                    </div>
                </div>

                ${starredCandidates.length > 0 ? `
                <div class="ballot-section">
                    <h3 class="ballot-section-title">Candidates</h3>
                    <div class="ballot-items">
                        ${starredCandidates.map(candidate => `
                            <div class="ballot-item">
                                <div class="ballot-item-main">
                                    <div class="candidate-name">${candidate.name}</div>
                                    <div class="candidate-office">${candidate.office_id || 'Office'}</div>
                                </div>
                                <span class="candidate-party">${candidate.party}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${starredMeasures.length > 0 ? `
                <div class="ballot-section">
                    <h3 class="ballot-section-title">Ballot Measures</h3>
                    <div class="ballot-items">
                        ${starredMeasures.map(measure => `
                            <div class="ballot-item">
                                <div class="ballot-item-main">
                                    <div class="measure-title">${measure.title}</div>
                                </div>
                                <span class="measure-category">${measure.category}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">
                <span>📖</span> Voting Resources
            </div>
            <div class="voting-resources">
                <p style="margin-bottom: 16px; color: #64748b; font-size: 14px;">
                    Need help navigating the voting process? <br> We've got you covered.
                </p>
                <div class="resource-buttons">
                    <a href="https://drive.google.com/file/d/1veBQRpP-Cym30GPnEkbca73dA4pkzsbu/view?usp=sharing" class="cta-button">
                        📋 Flint's Official Voting Guide
                    </a>
                </div>
            </div>
        </div>

        <div class="voting-info">
            <div class="voting-date">📅 November 5, 2024</div>
            <div class="voting-hours">Polls open 7:00 AM - 8:00 PM</div>
            <a href="https://www.vote.org/polling-place-locator/" class="cta-button">Find Your Polling Place</a>
        </div>

        <div class="footer">
            <p>This personalized voting guide was created for ${userEmail}</p>
            <p>Generated by Flint - Making civic engagement easier for everyone</p>
            <p><a href="#" style="color: #3b82f6;">Share Flint</a></p>
        </div>
    </div>
</body>
</html>
    `;

  const textContent = `
Your Personalized Voting Guide

Location: ZIP ${userProfile.zipCode}
Selected Issues: ${userProfile.selectedIssues.join(', ')}

SAMPLE BALLOT - YOUR SELECTIONS:
${starredCandidates.length > 0 ? `
CANDIDATES:
${starredCandidates.map(c => `- ${c.name} (${c.party}) for ${c.office_id}`).join('\n')}
` : ''}
${starredMeasures.length > 0 ? `
BALLOT MEASURES:
${starredMeasures.map(m => `- ${m.title} (${m.category})`).join('\n')}
` : ''}

VOTING RESOURCES:
- Official Voting Guide: https://www.vote.org/voter-guide/
- Sample Ballot Tool: https://www.vote.org/ballot/
- Find Your Polling Place: https://www.vote.org/polling-place-locator/

IMPORTANT DATES:
Election Day: November 5, 2024
Polls open: 7:00 AM - 8:00 PM

Generated by Flint for ${userEmail}
  `;

  return {
    subject,
    htmlContent,
    textContent
  };
}

/**
 * Generate simple follow-up email for civic engagement updates
 */
export function generateFollowUpEmail(userEmail: string): EmailContent {
  const subject = "Stay Connected with Flint - Civic Engagement Updates";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stay Connected with Flint</title>
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
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .footer {
            text-align: center;
            padding-top: 32px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Flint</div>
        </div>

        <h2>Thank you for joining the Flint community!</h2>

        <p>We're excited to have you as part of our mission to make civic engagement easier and more accessible for everyone.</p>

        <p>You'll receive updates about:</p>
        <ul>
            <li>Upcoming elections and voting deadlines</li>
            <li>New features to help you stay civically engaged</li>
            <li>Local civic events and opportunities</li>
        </ul>

        <p>Together, we can make democracy more accessible and ensure every voice is heard.</p>

        <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>Generated by Flint - Making civic engagement easier for everyone</p>
        </div>
    </div>
</body>
</html>
  `;

  const textContent = `
Thank you for joining the Flint community!

We're excited to have you as part of our mission to make civic engagement easier and more accessible for everyone.

You'll receive updates about:
- Upcoming elections and voting deadlines
- New features to help you stay civically engaged
- Local civic events and opportunities

Together, we can make democracy more accessible and ensure every voice is heard.

This email was sent to ${userEmail}
Generated by Flint - Making civic engagement easier for everyone
  `;

  return {
    subject,
    htmlContent,
    textContent
  };
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

/**
 * Send email using EmailJS service
 */
export async function sendEmailWithEmailJS(
  emailContent: EmailContent,
  recipientEmail: string,
  templateData?: Record<string, string | number | boolean>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate EmailJS configuration
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
    }

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: recipientEmail,
      subject: emailContent.subject,
      html_content: emailContent.htmlContent,
      text_content: emailContent.textContent,
      ...templateData
    };

    console.log('📧 Sending email via EmailJS...', {
      to: recipientEmail,
      subject: emailContent.subject
    });

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    if (response.status === 200) {
      console.log('✅ Email sent successfully via EmailJS');
      return { success: true };
    } else {
      throw new Error(`EmailJS responded with status: ${response.status}`);
    }

  } catch (error) {
    console.error('❌ Failed to send email via EmailJS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send voting guide email with ballot data
 */
export async function sendVotingGuideEmail(
  userEmail: string,
  userProfile: EmailTemplateData['userProfile'],
  starredCandidates: Candidate[] = [],
  starredMeasures: BallotMeasure[] = []
): Promise<{ success: boolean; error?: string }> {
  try {
    const templateData: EmailTemplateData = {
      userProfile,
      starredCandidates,
      starredMeasures,
      userEmail
    };

    const emailContent = generateVotingGuideEmail(templateData);

    return await sendEmailWithEmailJS(emailContent, userEmail, {
      user_zip: userProfile.zipCode,
      selected_issues: userProfile.selectedIssues.join(', '),
      candidates_count: starredCandidates.length,
      measures_count: starredMeasures.length
    });

  } catch (error) {
    console.error('❌ Failed to send voting guide email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send voting guide email'
    };
  }
}

/**
 * Send follow-up email for civic engagement updates
 */
export async function sendFollowUpEmail(
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailContent = generateFollowUpEmail(userEmail);

    return await sendEmailWithEmailJS(emailContent, userEmail, {
      email_type: 'follow_up'
    });

  } catch (error) {
    console.error('❌ Failed to send follow-up email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send follow-up email'
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if EmailJS is properly configured
 */
export function isEmailJSConfigured(): boolean {
  return !!(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);
}

/**
 * Get EmailJS configuration status for debugging
 */
export function getEmailJSStatus(): {
  configured: boolean;
  serviceId: boolean;
  templateId: boolean;
  publicKey: boolean;
} {
  return {
    configured: isEmailJSConfigured(),
    serviceId: !!EMAILJS_CONFIG.serviceId,
    templateId: !!EMAILJS_CONFIG.templateId,
    publicKey: !!EMAILJS_CONFIG.publicKey
  };
}
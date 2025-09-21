# EmailJS Email Sending Implementation

## Overview
Implement actual email sending functionality using EmailJS for the Flint Spark civic engagement app. This will replace the current mock email functionality with real email delivery.

## Current Status
✅ **Completed:**
- Email storage backend endpoints (`/api/email-signup`, `/api/user-completion`)
- Email preview functionality (`EmailPreview.tsx`)
- Debug dashboard for testing email storage
- Mock email submission in `CastItScreen` and `ThankYouScreen`

🔄 **Next:** Replace mock email sending with real EmailJS integration

## Implementation Plan

### Phase 1: EmailJS Setup & Dependencies
- [ ] Install EmailJS SDK: `npm install @emailjs/browser`
- [ ] Create EmailJS account at emailjs.com
- [ ] Obtain credentials:
  - Service ID
  - Template ID
  - Public Key
- [ ] Configure email service (Gmail/Outlook) in EmailJS dashboard

### Phase 2: Email Service Module
- [ ] Create `src/lib/emailService.ts` with:
  - `generateVotingGuideEmail()` function
  - `sendEmailWithEmailJS()` function
  - HTML email template builder
  - Plain text email builder
  - Template utility functions

### Phase 3: Email Template Design
- [ ] HTML email template with:
  - Flint branding and logo
  - User voting information (ZIP, issues)
  - Candidates section (starred candidates)
  - Ballot measures section (starred measures)
  - Voting dates and polling information
  - Call-to-action buttons
  - Footer with unsubscribe
- [ ] Plain text version for compatibility
- [ ] Responsive design for mobile email clients

### Phase 4: Frontend Integration
- [ ] Update `CastItScreen.tsx`:
  - Replace mock `apiClient.storeEmailSignup()` call
  - Add real email sending with ballot data
  - Enhance loading states and error handling
- [ ] Update `ThankYouScreen.tsx`:
  - Add real email sending for follow-up emails
  - Integrate with EmailJS service
- [ ] Update `EmailPreview.tsx`:
  - Use same template generator as real emails
  - Ensure preview matches actual sent emails

### Phase 5: Email Content Enhancement
- [ ] Dynamic polling location URLs based on ZIP code
- [ ] Voting dates and important deadlines
- [ ] PDF download links (placeholder for future)
- [ ] Social sharing buttons
- [ ] Unsubscribe handling

### Phase 6: Testing & Validation
- [ ] Test email delivery across different email clients
- [ ] Verify HTML rendering in Gmail, Outlook, Apple Mail
- [ ] Test with real user data and ballot selections
- [ ] Validate error handling and fallbacks
- [ ] Check spam folder placement

## Technical Implementation Details

### EmailJS Template Variables
```javascript
{
  user_email: string,
  user_zip: string,
  selected_issues: string,
  candidates_html: string,
  measures_html: string,
  voting_date: string,
  polling_url: string
}
```

### Email Content Structure
```
📧 Email Layout:
├── Header (Flint logo + title)
├── User Info (ZIP, issues, demographics)
├── Candidates Section (starred candidates)
├── Ballot Measures Section (starred measures)
├── Voting Information (dates, polling)
├── Action Buttons (PDF, polling, share)
└── Footer (unsubscribe, branding)
```

### Integration Points
- **CastItScreen**: Send ballot preview email
- **ThankYouScreen**: Send follow-up email
- **Backend**: Continue storing email signups for analytics
- **Debug Dashboard**: Preview actual email content

## Benefits of EmailJS Approach
- ✅ No backend email server setup required
- ✅ Quick implementation (2-3 hours)
- ✅ Free tier: 200 emails/month
- ✅ Professional email delivery
- ✅ Built-in unsubscribe handling
- ✅ Perfect for project scale

## Files to Modify
1. `src/lib/emailService.ts` (new)
2. `src/screens/CastItScreen.tsx`
3. `src/screens/ThankYouScreen.tsx`
4. `src/components/EmailPreview.tsx`
5. `package.json` (add EmailJS dependency)

## Testing Strategy
1. **Development**: Use personal email for testing
2. **Debug Dashboard**: Preview email content before sending
3. **Error Handling**: Test network failures and EmailJS errors
4. **Email Clients**: Test rendering across major email providers
5. **User Flow**: Complete end-to-end ballot selection → email delivery

## Notes
- Keep existing backend email storage for analytics
- EmailJS handles actual delivery, backend tracks signups
- Consider rate limiting on frontend to prevent spam
- Add email validation before sending
- Plan for future migration to backend email service if scale requires

---

**Priority**: Medium (after Supabase migration)
**Estimated Time**: 2-3 hours implementation + 1 hour testing
**Dependencies**: EmailJS account setup, template configuration
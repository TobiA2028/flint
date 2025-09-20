import { useState } from 'react';
import { IssueCard } from '@/components/IssueCard';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { ISSUES } from '@/data/issues';
import { ArrowRight } from 'lucide-react';

interface IssueSelectionScreenProps {
  selectedIssues: string[];
  onIssuesChange: (issues: string[]) => void;
  onContinue: () => void;
}

export const IssueSelectionScreen = ({ 
  selectedIssues, 
  onIssuesChange, 
  onContinue 
}: IssueSelectionScreenProps) => {
  const maxSelections = 3;
  const canContinue = selectedIssues.length === maxSelections;

  const handleIssueSelect = (issueId: string) => {
    if (selectedIssues.includes(issueId)) {
      onIssuesChange(selectedIssues.filter(id => id !== issueId));
    } else if (selectedIssues.length < maxSelections) {
      onIssuesChange([...selectedIssues, issueId]);
    }
  };

  const getMascotMessage = () => {
    if (selectedIssues.length === 0) {
      return "Pick the 3 issues that matter most to you!";
    } else if (selectedIssues.length < maxSelections) {
      return `Great choice! Select ${maxSelections - selectedIssues.length} more.`;
    } else {
      return "Perfect! These issues will guide your civic journey.";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={2} totalSteps={7} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            What issues matter most to you?
          </h1>
          
          <p className="text-muted-foreground mb-2">
            Choose exactly <span className="font-semibold text-accent">{maxSelections} issues</span> that you care about
          </p>
          
          <div className="flex justify-center items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Selected:</span>
            <span className={`font-semibold ${canContinue ? 'text-success' : 'text-accent'}`}>
              {selectedIssues.length}/{maxSelections}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {ISSUES.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isSelected={selectedIssues.includes(issue.id)}
              onSelect={handleIssueSelect}
              disabled={!selectedIssues.includes(issue.id) && selectedIssues.length >= maxSelections}
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            disabled={!canContinue}
            variant={canContinue ? 'civic' : 'outline'}
            className="min-w-[200px]"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { ISSUES } from '@/data/issues';
import { Users, TrendingUp, ArrowRight } from 'lucide-react';

interface SocialProofScreenProps {
  selectedIssues: string[];
  zipCode: string;
  onContinue: () => void;
}

export const SocialProofScreen = ({ selectedIssues, zipCode, onContinue }: SocialProofScreenProps) => {
  const getIssueNames = () => {
    return selectedIssues.map(id => 
      ISSUES.find(issue => issue.id === id)?.name
    ).filter(Boolean);
  };

  // Mock data - in real app would come from API
  const mockStats = {
    totalPeople: Math.floor(Math.random() * 5000) + 1000,
    issueEngagement: selectedIssues.map((issueId, index) => ({
      id: issueId,
      name: ISSUES.find(issue => issue.id === issueId)?.name || '',
      count: Math.floor(Math.random() * 800) + 200 + (index * 50)
    }))
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={4} totalSteps={7} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            You're not alone!
          </h1>
          
          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-civic mr-3" />
              <div className="text-left">
                <div className="text-3xl font-bold text-civic">
                  {mockStats.totalPeople.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  people in your area care about these same issues
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-foreground text-center mb-6">
            Your issues, by the numbers:
          </h2>
          
          {mockStats.issueEngagement.map((issue, index) => (
            <div key={issue.id} className="bg-card rounded-lg p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-card-foreground">{issue.name}</span>
                <div className="flex items-center text-civic">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{issue.count}</span>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-civic-gradient h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min((issue.count / 1000) * 100, 100)}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                community members engaged
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-accent/10 rounded-xl p-6 text-center mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Together, these issues add up to real change
          </h3>
          <p className="text-muted-foreground">
            When people like you engage with local government, communities thrive. 
            Your voice matters, and you're not the only one who cares.
          </p>
        </div>
        
        <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            variant="spark"
            className="min-w-[200px]"
          >
            Let's Spark Change
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
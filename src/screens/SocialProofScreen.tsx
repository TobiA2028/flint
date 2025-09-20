import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { ISSUES } from '@/data/issues';
import { Users, TrendingUp, ArrowRight } from 'lucide-react';
import { SparkHeader } from '@/components/SparkHeader';

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
          
          <SparkHeader
            title="You are not alone!"
            subtitle="People in your community care about solving these issues."
                  />
          
          {/* <div className="bg-card rounded-xl p-6 shadow-card mb-6">
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
          </div> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mockStats.issueEngagement.slice(0, 3).map((issue, index) => {
            return (
              <div key={issue.id} className="bg-card rounded-xl p-6 shadow-card text-center">
                <div className="mb-6">
                  <div className="w-full h-32 bg-civic/10 rounded-lg mb-3 flex items-center justify-center">
                    <div className="flex space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <Users 
                          key={i} 
                          className={`w-4 h-4 ${i < 5 ? 'text-civic' : 'text-civic/40'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  {issue.name}
                </h3>
                
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-civic">
                    {issue.count.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  people in your community
                </p>
                <p className="text-sm text-muted-foreground">
                  care about this issue
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="bg-accent/10 rounded-xl p-6 text-center mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to make an impact?
          </h3>
          <p className="text-muted-foreground">
            Now let's connect your issues to the specific local offices that shape policy in these areas.
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
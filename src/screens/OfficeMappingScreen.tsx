import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { OfficeCard } from '@/components/OfficeCard';
import { BallotMeasureCard } from '@/components/BallotMeasureCard';
import { ISSUES } from '@/data/issues';
import { ArrowRight } from 'lucide-react';
import { SparkHeader } from '@/components/SparkHeader';

interface OfficeMappingScreenProps {
  selectedIssues: string[];
  onContinue: () => void;
}

// Mock office data - in real app would come from API
const getOfficesForIssues = (issueIds: string[]) => {
  const officeMapping: Record<string, Array<{
    id: string;
    name: string;
    description: string;
    explanation: string;
    level: 'local' | 'state' | 'federal';
  }>> = {
    housing: [
      {
        id: 'city-council',
        name: 'City Council',
        description: 'District Representative',
        explanation: 'City Council members vote on zoning laws, affordable housing projects, and rent control policies that directly affect housing costs in your neighborhood.',
        level: 'local'
      }
    ],
    education: [
      {
        id: 'school-board',
        name: 'School Board',
        description: 'District Trustee',
        explanation: 'School Board members decide on curriculum, teacher hiring, school funding allocation, and policies that shape your local schools.',
        level: 'local'
      }
    ],
    healthcare: [
      {
        id: 'county-commissioner',
        name: 'County Commissioner',
        description: 'Public Health District',
        explanation: 'County Commissioners oversee public health departments, mental health services, and healthcare access programs in your area.',
        level: 'local'
      }
    ],
    environment: [
      {
        id: 'mayor',
        name: 'Mayor',
        description: 'City Executive',
        explanation: 'The Mayor sets environmental policy priorities, oversees sustainability initiatives, and can influence green infrastructure projects.',
        level: 'local'
      }
    ],
    transportation: [
      {
        id: 'transit-board',
        name: 'Transit Authority Board',
        description: 'Transportation District',
        explanation: 'Transit Board members make decisions about bus routes, subway expansions, bike lanes, and public transportation funding.',
        level: 'local'
      }
    ],
    safety: [
      {
        id: 'sheriff',
        name: 'County Sheriff',
        description: 'Law Enforcement',
        explanation: 'The Sheriff oversees county law enforcement, jail operations, and community policing strategies that affect public safety.',
        level: 'local'
      }
    ]
  };

  return issueIds.map(issueId => {
    const issue = ISSUES.find(i => i.id === issueId);
    const offices = officeMapping[issueId] || [
      {
        id: 'city-council-general',
        name: 'City Council',
        description: 'At-Large Representative',
        explanation: `City Council members vote on policies and budgets that affect ${issue?.name.toLowerCase()} issues in your community.`,
        level: 'local' as const
      }
    ];
    
    return {
      issue,
      offices
    };
  });
};

// Mock ballot measures data - only for selected issues
const getBallotMeasuresForIssues = (issueIds: string[]) => {
  const ballotMeasureMapping: Record<string, Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    impact: string;
    isStarred: boolean;
  }>> = {
    education: [
      {
        id: 'measure-edu-1',
        title: 'School Bond Initiative - Measure A',
        description: 'Authorizes $500 million in bonds to modernize school facilities, upgrade technology infrastructure, and improve safety systems across all district schools.',
        category: 'Education',
        impact: 'Would increase property taxes by approximately $45 per year for the average homeowner',
        isStarred: false
      }
    ],
    transportation: [
      {
        id: 'measure-trans-1', 
        title: 'Public Transit Expansion - Measure B',
        description: 'Funds the extension of light rail service to underserved communities and increases bus frequency during peak hours.',
        category: 'Transportation',
        impact: 'Would provide improved transit access to 25,000 additional residents',
        isStarred: false
      }
    ],
    environment: [
      {
        id: 'measure-env-1',
        title: 'Clean Energy Initiative - Measure C', 
        description: 'Requires the city to transition to 100% renewable energy by 2030 and establishes a green jobs training program.',
        category: 'Environment',
        impact: 'Would create an estimated 500 new green jobs over the next 5 years',
        isStarred: false
      }
    ]
  };

  return issueIds.map(issueId => {
    const issue = ISSUES.find(i => i.id === issueId);
    const measures = ballotMeasureMapping[issueId] || [];
    
    return {
      issue,
      measures
    };
  }).filter(item => item.measures.length > 0); // Only return issues that have ballot measures
};

export const OfficeMappingScreen = ({ selectedIssues, onContinue }: OfficeMappingScreenProps) => {
  const mappedOffices = getOfficesForIssues(selectedIssues);
  const mappedBallotMeasures = getBallotMeasuresForIssues(selectedIssues);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <ProgressIndicator currentStep={5} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <SparkHeader
            title="Your vote is your spark!"
            subtitle="These local offices and ballot items directly impact what you care about."
          />

        </div>
        
        <div className="space-y-6 mb-8">
          {mappedOffices.map(({ issue, offices }) => (
            <div key={issue?.id} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-semibold text-sm">
                    {issue?.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{issue?.name}</h2>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground uppercase text-sm tracking-wider">
                  Positions
                </h3>
                {offices.map(office => (
                  <OfficeCard key={office.id} office={office} />
                ))}
              </div>

              {/* Ballot Measures for this issue */}
              {(() => {
                const ballotMeasuresForIssue = mappedBallotMeasures.find(item => item.issue?.id === issue?.id);
                if (!ballotMeasuresForIssue || ballotMeasuresForIssue.measures.length === 0) return null;
                
                return (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-lg font-semibold text-muted-foreground uppercase text-sm tracking-wider">
                      Ballot Measures
                    </h3>
                    {ballotMeasuresForIssue.measures.map(measure => (
                      <div key={measure.id} className="relative">
                        <BallotMeasureCard 
                          measure={measure}
                          isStarred={false}
                          onToggleStar={() => {}} // Display only, no starring on this screen
                          showStar={false}
                        />
                        {/* STATE tag overlay - positioned to match OfficeCard level tags */}
                        <div className="absolute top-4 right-4">
                          <span className="text-xs font-medium px-2 py-1 bg-civic/10 text-civic rounded-full">
                            STATE
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            variant="spark"
            className="min-w-[200px]"
          >
            See Your Choices
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
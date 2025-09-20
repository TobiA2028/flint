import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Card } from '@/components/ui/card';
import { ISSUES } from '@/data/issues';
import { Building, ArrowRight, ExternalLink } from 'lucide-react';

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

export const OfficeMappingScreen = ({ selectedIssues, onContinue }: OfficeMappingScreenProps) => {
  const mappedOffices = getOfficesForIssues(selectedIssues);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <ProgressIndicator currentStep={5} totalSteps={7} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your issues connect to these offices
          </h1>
          
          <p className="text-muted-foreground">
            Each office has real power to address the issues you care about
          </p>
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
              
              {offices.map(office => (
                <Card key={office.id} className="p-6 shadow-card hover:shadow-civic transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-civic/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-civic" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-card-foreground">
                          {office.name}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-civic/10 text-civic rounded-full">
                          {office.level.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {office.description}
                      </p>
                      
                      <p className="text-sm text-card-foreground leading-relaxed mb-4">
                        {office.explanation}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-civic">
                          View candidates & positions
                        </span>
                        <ExternalLink className="w-4 h-4 text-civic" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            variant="civic"
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
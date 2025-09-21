import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { CandidateCard } from '@/components/CandidateCard';
import { BallotMeasureCard } from '@/components/BallotMeasureCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Candidate, BallotMeasure, Issue } from '@/types';
import { Vote, ArrowRight } from 'lucide-react';

interface CandidatesScreenProps {
  selectedIssues: string[];
  starredCandidates: string[];
  starredMeasures: string[];
  onToggleStarredCandidate: (candidateId: string) => void;
  onToggleStarredMeasure: (measureId: string) => void;
  onContinue: () => void;
  issues: Issue[];
}

// Mock data - in real app would come from API
const mockCandidates: Candidate[] = [
  {
    id: 'candidate-1',
    name: 'Sarah Chen',
    party: 'Democratic',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    positions: [
      'Supports affordable housing initiatives and rent stabilization',
      'Advocates for increased funding for public education',
      'Champions climate action and renewable energy programs'
    ],
    officeId: 'city-council',
    isStarred: false
  },
  {
    id: 'candidate-2',
    name: 'Marcus Johnson',
    party: 'Republican',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    positions: [
      'Focuses on reducing regulations for small businesses',
      'Supports traditional law enforcement approaches',
      'Advocates for fiscal responsibility in city budgeting'
    ],
    officeId: 'city-council',
    isStarred: false
  },
  {
    id: 'candidate-3',
    name: 'Elena Rodriguez',
    party: 'Independent',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    positions: [
      'Prioritizes community-driven solutions to local issues',
      'Supports sustainable transportation and infrastructure',
      'Advocates for transparent government and citizen engagement'
    ],
    officeId: 'mayor',
    isStarred: false
  }
];

const mockMeasures: BallotMeasure[] = [
  {
    id: 'measure-1',
    title: 'School Bond Initiative - Measure A',
    description: 'Authorizes $500 million in bonds to fund school construction, technology upgrades, and facility improvements across the district.',
    category: 'Education',
    impact: 'Would improve educational facilities for over 25,000 students and create approximately 2,000 construction jobs.',
    isStarred: false
  },
  {
    id: 'measure-2',
    title: 'Transit Expansion Tax - Measure B',
    description: 'Increases sales tax by 0.5% to fund bus rapid transit, bike lanes, and electric vehicle charging stations.',
    category: 'Transportation',
    impact: 'Would expand public transit access to underserved areas and reduce carbon emissions by an estimated 15%.',
    isStarred: false
  }
];

export const CandidatesScreen = ({
  selectedIssues,
  starredCandidates,
  starredMeasures,
  onToggleStarredCandidate,
  onToggleStarredMeasure,
  onContinue,
  issues
}: CandidatesScreenProps) => {
  const [activeTab, setActiveTab] = useState('candidates');
  
  const totalStarred = starredCandidates.length + starredMeasures.length;
  const canContinue = totalStarred > 0;

  const getRelevantIssuesForCandidate = (candidate: Candidate) => {
    // In real app, would match candidate positions to user's selected issues
    return selectedIssues.slice(0, 2).map(id =>
      issues.find(issue => issue.id === id)?.name
    ).filter(Boolean) as string[];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={6} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your ballot, made simple!
          </h1>
          
          <p className="text-muted-foreground mb-4">
            Based on your selected issues. Star the ones you want to remember and follow-up on!
          </p>
          
          <div className="flex justify-center items-center space-x-2 text-sm">
            <Vote className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Starred:</span>
            <span className={`font-semibold ${totalStarred > 0 ? 'text-success' : 'text-muted-foreground'}`}>
              {totalStarred}
            </span>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidates">
              Candidates ({mockCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="measures">
              Ballot Measures ({mockMeasures.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {mockCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isStarred={starredCandidates.includes(candidate.id)}
                  onToggleStar={onToggleStarredCandidate}
                  relevantIssues={getRelevantIssuesForCandidate(candidate)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="measures" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {mockMeasures.map(measure => (
                <BallotMeasureCard
                  key={measure.id}
                  measure={measure}
                  isStarred={starredMeasures.includes(measure.id)}
                  onToggleStar={onToggleStarredMeasure}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            disabled={!canContinue}
            variant={'spark'}
            className="min-w-[200px]"
          >
            Create My Ballot Preview
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
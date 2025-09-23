import { useState, useEffect } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2 } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Candidate, BallotMeasure } from '@/types';

interface BallotPreviewScreenProps {
  starredCandidates: string[];
  starredMeasures: string[];
  zipCode: string;
  selectedIssues: string[];
  onContinue: () => void;
  onRestart: () => void;
}

// State interfaces for API data
interface CandidateWithOffice extends Candidate {
  officeName?: string;
}

export const BallotPreviewScreen = ({
  starredCandidates,
  starredMeasures,
  zipCode,
  selectedIssues,
  onContinue,
  onRestart
}: BallotPreviewScreenProps) => {
  // API data state
  const [allCandidates, setAllCandidates] = useState<CandidateWithOffice[]>([]);
  const [allBallotMeasures, setAllBallotMeasures] = useState<BallotMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch candidates and ballot measures filtered by selected issues
        const [candidatesResponse, measuresResponse, officesResponse] = await Promise.all([
          apiClient.getCandidates(selectedIssues),
          apiClient.getBallotMeasures(selectedIssues),
          apiClient.getOffices(selectedIssues)
        ]);

        if (candidatesResponse.success && measuresResponse.success && officesResponse.success) {
          // Create a map of office IDs to office names for candidate display
          const officeMap = new Map(
            officesResponse.data.offices.map(office => [office.id, office.name])
          );

          // Add office names to candidates
          const candidatesWithOffice = candidatesResponse.data.candidates.map(candidate => ({
            ...candidate,
            officeName: officeMap.get(candidate.office_id) || 'Unknown Office'
          }));

          setAllCandidates(candidatesWithOffice);
          setAllBallotMeasures(measuresResponse.data.ballot_measures);
        } else {
          const errors = [];
          if (!candidatesResponse.success) errors.push(candidatesResponse.error);
          if (!measuresResponse.success) errors.push(measuresResponse.error);
          if (!officesResponse.success) errors.push(officesResponse.error);
          throw new Error(`Failed to load data: ${errors.join(', ')}`);
        }
      } catch (err) {
        console.error('Error fetching ballot preview data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ballot data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedIssues]);

  // Filter data to only show starred items
  const starredCandidateData = allCandidates.filter(candidate =>
    starredCandidates.includes(candidate.id)
  );

  const starredMeasureData = allBallotMeasures.filter(measure =>
    starredMeasures.includes(measure.id)
  );
  const hasStarredItems = starredCandidates.length > 0 || starredMeasures.length > 0;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator currentStep={7} totalSteps={10} />
          <div className="text-center mb-8">
            <MascotGuide size="lg" className="mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Loading your ballot preview
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-muted-foreground">Fetching your selections...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator currentStep={7} totalSteps={10} />
          <div className="text-center mb-8">
            <MascotGuide size="lg" className="mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Unable to load ballot data
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <CTAButton onClick={() => window.location.reload()} variant="spark">
              Try Again
            </CTAButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <ProgressIndicator currentStep={7} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="lg"
            className="mb-6"
          />
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your ballot preview
          </h1>
          
          <p className="text-muted-foreground">
            Save this guide and use it when you vote
          </p>
        </div>

        {hasStarredItems ? (
          <div className="space-y-8">
            {/* Ballot Summary */}
            <Card className="p-6 shadow-card print:shadow-none">
              <div className="flex items-center justify-between mb-4 print:mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Your Selections
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>ZIP: {zipCode}</span>
                </div>
              </div>
              
              {/* Candidates */}
              {starredCandidateData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-card-foreground mb-4">
                    Candidates
                  </h3>
                  <div className="space-y-3">
                    {starredCandidateData.map((candidate: CandidateWithOffice) => (
                      <div key={candidate.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.officeName}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {candidate.party}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ballot Measures */}
              {starredMeasureData.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-card-foreground mb-4">
                    Ballot Measures
                  </h3>
                  <div className="space-y-3">
                    {starredMeasureData.map((measure: BallotMeasure) => (
                      <div key={measure.id} className="p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-card-foreground">
                              {measure.title}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {measure.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>


            {/* Action Buttons */}
            <div className="flex justify-center">
          <CTAButton
            onClick={onContinue}
            variant="spark"
            className="min-w-[200px]"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
          </div>
        ) : (
          <Card className="p-8 text-center shadow-card">
            <p className="text-muted-foreground mb-6">
              You haven't starred any candidates or measures yet.
            </p>
            <CTAButton
              onClick={() => window.history.back()}
              variant="spark"
            >
              Go Back to Make Selections
            </CTAButton>
          </Card>
        )}
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { CandidateCard } from '@/components/CandidateCard';
import { BallotMeasureCard } from '@/components/BallotMeasureCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Candidate, BallotMeasure, Issue } from '@/types';
import { Vote, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface CandidatesScreenProps {
  selectedIssues: string[];
  displayedOffices: string[];
  starredCandidates: string[];
  starredMeasures: string[];
  onToggleStarredCandidate: (candidateId: string) => void;
  onToggleStarredMeasure: (measureId: string) => void;
  onContinue: () => void;
  issues: Issue[];
}

/**
 * BACKEND INTEGRATION APPROACH FOR CANDIDATES SCREEN:
 * ===================================================
 * This component now fetches candidates and ballot measures from the backend
 * based on the offices displayed in OfficeMappingScreen, providing personalized civic content.
 *
 * DATA FETCHING STRATEGY:
 * ======================
 * 1. Fetch candidates running for offices shown in OfficeMappingScreen
 * 2. Fetch ballot measures that address selected issues
 * 3. Update candidate relevance indicators based on issue matching
 * 4. Maintain starring functionality with frontend state
 *
 * PERFORMANCE CONSIDERATIONS:
 * ==========================
 * - API calls are triggered only when displayedOffices change
 * - Loading states provide immediate user feedback
 * - Error handling ensures graceful degradation
 * - Could be optimized with React Query for caching and background updates
 */

export const CandidatesScreen = ({
  selectedIssues,
  displayedOffices,
  starredCandidates,
  starredMeasures,
  onToggleStarredCandidate,
  onToggleStarredMeasure,
  onContinue,
  issues
}: CandidatesScreenProps) => {
  // ============================================================================
  // STATE MANAGEMENT - Backend data and UI state
  // ============================================================================

  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [ballotMeasures, setBallotMeasures] = useState<BallotMeasure[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [isLoadingMeasures, setIsLoadingMeasures] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalStarred = starredCandidates.length + starredMeasures.length;
  const canContinue = totalStarred > 0;

  // ============================================================================
  // DATA FETCHING - Load candidates and ballot measures from backend
  // ============================================================================

  useEffect(() => {
    const fetchCandidatesData = async () => {
      if (displayedOffices.length === 0) {
        // No offices displayed, clear candidate data but still fetch ballot measures
        setCandidates([]);
        // Don't return here - still fetch ballot measures based on selectedIssues
      }

      console.log('🔄 CandidatesScreen: Fetching civic data for offices:', displayedOffices, 'and issues:', selectedIssues);

      // Reset error state
      setError(null);

      // Fetch candidates and ballot measures in parallel
      const fetchPromises = [
        // Fetch candidates running for displayed offices
        (async () => {
          setIsLoadingCandidates(true);
          try {
            if (displayedOffices.length > 0) {
              const response = await apiClient.getCandidates({ officeIds: displayedOffices });
              if (response.success) {
                setCandidates(response.data.candidates);
                console.log('✅ Fetched candidates:', response.data.candidates.length);
              } else {
                console.error('❌ Failed to fetch candidates:', response.error);
                setError(`Failed to load candidates: ${response.error}`);
              }
            } else {
              // No offices to fetch candidates for
              setCandidates([]);
            }
          } catch (err) {
            console.error('❌ Candidates fetch error:', err);
            setError('Failed to load candidates');
          } finally {
            setIsLoadingCandidates(false);
          }
        })(),

        // Fetch ballot measures relevant to selected issues
        (async () => {
          setIsLoadingMeasures(true);
          try {
            const response = await apiClient.getBallotMeasures(selectedIssues);
            if (response.success) {
              setBallotMeasures(response.data.ballot_measures);
              console.log('✅ Fetched ballot measures:', response.data.ballot_measures.length);
            } else {
              console.error('❌ Failed to fetch ballot measures:', response.error);
              setError(`Failed to load ballot measures: ${response.error}`);
            }
          } catch (err) {
            console.error('❌ Ballot measures fetch error:', err);
            setError('Failed to load ballot measures');
          } finally {
            setIsLoadingMeasures(false);
          }
        })()
      ];

      // Wait for both API calls to complete
      await Promise.all(fetchPromises);
    };

    fetchCandidatesData();
  }, [displayedOffices, selectedIssues]); // Re-fetch when displayedOffices or selectedIssues change

  // ============================================================================
  // OPTIMIZED DATA ORGANIZATION - Performance-enhanced lookups
  // ============================================================================

  /**
   * Create lookup maps for O(1) entity access by ID
   *
   * PERFORMANCE OPTIMIZATION FOR CANDIDATES SCREEN:
   * ===============================================
   * While CandidatesScreen doesn't have the same filtering complexity as OfficeMappingScreen,
   * we still benefit from creating lookup maps for issue name resolution and potential
   * future optimizations when displaying office information for candidates.
   */
  const issueMap = new Map(issues.map(issue => [issue.id, issue]));

  /**
   * Calculate relevant issues for a candidate based on their platform and office (OPTIMIZED)
   *
   * EFFICIENT RELEVANCE ALGORITHM:
   * ==============================
   * 1. Check direct issue alignment (candidate.related_issues)
   * 2. Use Map lookup for O(1) issue name resolution
   * 3. Return intersection with user's selected issues for highlighting
   *
   * Performance improvement:
   * - OLD: Array.find() for each issue = O(n × m)
   * - NEW: Map.get() for each issue = O(n)
   */
  const getRelevantIssuesForCandidate = (candidate: Candidate): string[] => {
    const relevantIssueIds = new Set<string>();

    // Add directly related issues from candidate platform
    candidate.related_issues?.forEach(issueId => {
      if (selectedIssues.includes(issueId)) {
        relevantIssueIds.add(issueId);
      }
    });

    // PERFORMANCE OPTIMIZATION: Use Map lookup instead of Array.find()
    // Convert to issue names for display using O(1) Map access
    return Array.from(relevantIssueIds)
      .map(issueId => issueMap.get(issueId)?.name)
      .filter((name): name is string => name !== undefined);
  };

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  const isLoading = isLoadingCandidates || isLoadingMeasures;

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={6} totalSteps={10} />

          <div className="text-center mb-8">
            <MascotGuide size="md" className="mb-6" />
            <div className="text-red-600 mb-4">
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p>{error}</p>
            </div>
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
              Candidates ({isLoading ? '...' : candidates.length})
            </TabsTrigger>
            <TabsTrigger value="measures">
              Ballot Measures ({isLoading ? '...' : ballotMeasures.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6 mt-6">
            {/* Loading state for candidates */}
            {isLoadingCandidates && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading candidates who align with your issues...</p>
              </div>
            )}

            {/* Candidates grid */}
            {!isLoadingCandidates && candidates.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {candidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={{ ...candidate, isStarred: starredCandidates.includes(candidate.id) }}
                    isStarred={starredCandidates.includes(candidate.id)}
                    onToggleStar={onToggleStarredCandidate}
                    relevantIssues={getRelevantIssuesForCandidate(candidate)}
                  />
                ))}
              </div>
            )}

            {/* Empty state for candidates */}
            {!isLoadingCandidates && candidates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                  <p>We couldn't find candidates aligned with your selected issues.</p>
                  <p className="text-sm">Try selecting different issues or check back later!</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="measures" className="space-y-6 mt-6">
            {/* Loading state for ballot measures */}
            {isLoadingMeasures && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading ballot measures relevant to your issues...</p>
              </div>
            )}

            {/* Ballot measures grid */}
            {!isLoadingMeasures && ballotMeasures.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {ballotMeasures.map(measure => (
                  <BallotMeasureCard
                    key={measure.id}
                    measure={{ ...measure, isStarred: starredMeasures.includes(measure.id) }}
                    isStarred={starredMeasures.includes(measure.id)}
                    onToggleStar={onToggleStarredMeasure}
                  />
                ))}
              </div>
            )}

            {/* Empty state for ballot measures */}
            {!isLoadingMeasures && ballotMeasures.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <h3 className="text-lg font-semibold mb-2">No ballot measures found</h3>
                  <p>We couldn't find ballot measures addressing your selected issues.</p>
                  <p className="text-sm">Try selecting different issues or check back later!</p>
                </div>
              </div>
            )}
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
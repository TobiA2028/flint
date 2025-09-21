import { useState, useEffect } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { OfficeCard } from '@/components/OfficeCard';
import { BallotMeasureCard } from '@/components/BallotMeasureCard';
import { ArrowRight } from 'lucide-react';
import { SparkHeader } from '@/components/SparkHeader';
import { Issue, Office, BallotMeasure, IssueMapping } from '@/types';
import { apiClient } from '@/lib/api';

interface OfficeMappingScreenProps {
  selectedIssues: string[];
  onContinue: () => void;
  // Issues prop for backend-driven data and issue context
  issues: Issue[];
  // Function to update displayed offices in app state
  updateDisplayedOffices: (officeIds: string[]) => void;
}

/**
 * BACKEND INTEGRATION APPROACH:
 * =============================
 * This component now uses backend APIs to fetch civic data instead of hardcoded arrays.
 *
 * DATA FLOW:
 * 1. Component mounts and triggers useEffect
 * 2. API calls fetch offices and ballot measures filtered by user's selected issues
 * 3. Data is organized by issue for display
 * 4. Loading states provide user feedback during API calls
 * 5. Error handling ensures graceful degradation
 *
 * PERFORMANCE OPTIMIZATIONS:
 * =========================
 * - API calls only trigger when selectedIssues change
 * - Could be further optimized with React Query for caching
 * - Error boundaries could provide better error handling
 */

export const OfficeMappingScreen = ({ selectedIssues, onContinue, issues, updateDisplayedOffices }: OfficeMappingScreenProps) => {
  // ============================================================================
  // STATE MANAGEMENT - Backend data and loading states
  // ============================================================================

  const [offices, setOffices] = useState<Office[]>([]);
  const [ballotMeasures, setBallotMeasures] = useState<BallotMeasure[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);
  const [isLoadingMeasures, setIsLoadingMeasures] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // DATA FETCHING - Load civic data from backend based on selected issues
  // ============================================================================

  useEffect(() => {
    /**
     * Fetch civic data when component mounts or selectedIssues change
     *
     * OPTIMIZATION STRATEGY:
     * =====================
     * - Only fetch when selectedIssues array changes
     * - Could use React Query for advanced caching
     * - Could batch API calls for better performance
     */

    const fetchCivicData = async () => {
      if (selectedIssues.length === 0) {
        // No issues selected, clear data
        setOffices([]);
        setBallotMeasures([]);
        return;
      }

      console.log('🔄 OfficeMappingScreen: Fetching civic data for issues:', selectedIssues);

      // Reset error state
      setError(null);

      // Fetch offices and ballot measures in parallel for better performance
      const fetchPromises = [
        // Fetch offices that handle the selected issues
        (async () => {
          setIsLoadingOffices(true);
          try {
            const response = await apiClient.getOffices(selectedIssues);
            if (response.success) {
              setOffices(response.data.offices);
              // Update app state with office IDs for candidates screen
              const officeIds = response.data.offices.map(office => office.id);
              updateDisplayedOffices(officeIds);
              console.log('✅ Fetched offices:', response.data.offices.length);
              console.log('✅ Updated displayed offices:', officeIds);
            } else {
              console.error('❌ Failed to fetch offices:', response.error);
              setError(`Failed to load offices: ${response.error}`);
            }
          } catch (err) {
            console.error('❌ Office fetch error:', err);
            setError('Failed to load offices');
          } finally {
            setIsLoadingOffices(false);
          }
        })(),

        // Fetch ballot measures that address the selected issues
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

    fetchCivicData();
  }, [selectedIssues]); // Dependency array: re-run when selectedIssues changes

  // ============================================================================
  // DATA ORGANIZATION - Optimized lookup for offices and ballot measures by issue
  // ============================================================================

  /**
   * Create lookup maps for O(1) entity access by ID
   *
   * PERFORMANCE OPTIMIZATION:
   * ========================
   * Instead of filtering arrays repeatedly, we create Maps for instant lookups.
   * This changes the performance from O(n × m) to O(n × k) where:
   * - n = number of selected issues
   * - m = total number of offices/measures (could be 100s)
   * - k = average offices/measures per issue (typically 1-2)
   *
   * Result: 10-50x performance improvement for larger datasets
   */
  const officeMap = new Map(offices.map(office => [office.id, office]));
  const ballotMeasureMap = new Map(ballotMeasures.map(measure => [measure.id, measure]));

  /**
   * Organize offices by the issues they handle (OPTIMIZED)
   *
   * EFFICIENT RELATIONSHIP MAPPING:
   * ==============================
   * Instead of filtering all offices for each issue, we directly access
   * the issue.related_offices array and use Map lookups for O(1) access.
   *
   * Performance comparison:
   * - OLD: selectedIssues.forEach(issue => offices.filter(...)) = O(n × m)
   * - NEW: selectedIssues.forEach(issue => issue.related_offices.map(...)) = O(n × k)
   */
  const organizeOfficesByIssue = (): IssueMapping<Office>[] => {
    return selectedIssues.map(issueId => {
      const issue = issues.find(i => i.id === issueId);

      if (!issue) return null; // Handle missing issue gracefully

      // PERFORMANCE OPTIMIZATION: Direct lookup from issue.related_offices
      // Instead of filtering all offices, get office IDs directly from issue
      const officeIds = issue.related_offices || [];

      // Use Map lookup for O(1) access to office objects
      const relevantOffices = officeIds
        .map(officeId => officeMap.get(officeId))
        .filter((office): office is Office => office !== undefined);

      return {
        issue,
        entities: relevantOffices
      };
    }).filter((mapping): mapping is IssueMapping<Office> => mapping !== null);
  };

  /**
   * Organize ballot measures by the issues they address (OPTIMIZED)
   *
   * EFFICIENT RELATIONSHIP MAPPING:
   * ==============================
   * Same optimization pattern as offices - use issue.related_measures
   * for direct access instead of filtering all ballot measures.
   */
  const organizeMeasuresByIssue = (): IssueMapping<BallotMeasure>[] => {
    return selectedIssues.map(issueId => {
      const issue = issues.find(i => i.id === issueId);

      if (!issue) return null;

      const measureIds = issue.related_measures || [];

      const relevantMeasures = measureIds
        .map(measureId => ballotMeasureMap.get(measureId))
        .filter((measure): measure is BallotMeasure => measure !== undefined);

      return {
        issue,
        entities: relevantMeasures
      };
    }).filter((mapping): mapping is IssueMapping<BallotMeasure> => mapping !== null);
    // ✅ keep all issues, even if entities.length === 0
  };

  const mappedOffices = organizeOfficesByIssue();
  const mappedBallotMeasures = organizeMeasuresByIssue();

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  const isLoading = isLoadingOffices || isLoadingMeasures;

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator currentStep={5} totalSteps={10} />

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
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your personalized civic information...</p>
            </div>
          )}

          {/* Render office mappings by issue */}
          {!isLoading && mappedOffices.map(({ issue, entities: offices }) => (
            <div key={issue.id} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-semibold text-sm">
                    {issue.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{issue.name}</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground uppercase text-sm tracking-wider">
                  Positions
                </h3>
                {offices.length > 0 ? (
                  offices.map(office => (
                    <OfficeCard key={office.id} office={office} />
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm p-4 bg-muted/50 rounded-lg">
                    No specific offices found for {issue.name}. Check back as we add more civic data!
                  </div>
                )}
              </div>

              {/* Ballot Measures for this issue */}
              {(() => {
                const ballotMeasuresForIssue = mappedBallotMeasures.find(item => item.issue.id === issue.id);
                if (!ballotMeasuresForIssue || ballotMeasuresForIssue.entities.length === 0) return null;

                return (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-lg font-semibold text-muted-foreground uppercase text-sm tracking-wider">
                      Ballot Measures
                    </h3>
                    {ballotMeasuresForIssue.entities.map(measure => (
                      <div key={measure.id} className="relative">
                        <BallotMeasureCard
                          measure={{ ...measure, isStarred: false }}
                          isStarred={false}
                          onToggleStar={() => { }} // Display only, no starring on this screen
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

          {/* Empty state when no data */}
          {!isLoading && mappedOffices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <h3 className="text-lg font-semibold mb-2">No civic data found</h3>
                <p>We couldn't find offices or ballot measures for your selected issues.</p>
                <p className="text-sm">Try selecting different issues or check back later!</p>
              </div>
            </div>
          )}
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
import { useState, useEffect } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { ISSUES } from '@/data/issues';
import { Users, TrendingUp, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { SparkHeader } from '@/components/SparkHeader';
import { apiClient, type IssueFrequencies } from '@/lib/api';

interface SocialProofScreenProps {
  selectedIssues: string[];
  zipCode: string;
  onContinue: () => void;
}

export const SocialProofScreen = ({ selectedIssues, zipCode, onContinue }: SocialProofScreenProps) => {
  // ========================================================================
  // API DATA STATE MANAGEMENT
  // ========================================================================

  /**
   * Real-time issue frequency data from backend
   *
   * This replaces the mock data and shows actual community engagement.
   */
  const [issueData, setIssueData] = useState<IssueFrequencies | null>(null);

  /**
   * Loading state for API calls
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Error state for failed API calls
   */
  const [error, setError] = useState<string>('');

  /**
   * Last refresh timestamp for cache busting
   */
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const getIssueNames = () => {
    return selectedIssues.map(id =>
      ISSUES.find(issue => issue.id === id)?.name
    ).filter(Boolean);
  };

  /**
   * Fetch real issue frequency data from backend
   *
   * This function demonstrates how to integrate API calls into React components
   * with proper loading states and error handling.
   */
  const fetchIssueData = async () => {
    try {
      console.log('🔄 Fetching real issue frequencies for social proof...');
      setIsLoading(true);
      setError('');

      const response = await apiClient.getIssueFrequencies();

      if (response.success) {
        setIssueData(response.data);
        setLastRefresh(new Date());
        console.log('✅ Successfully loaded issue frequencies:', response.data);
      } else {
        throw new Error(response.error || 'Failed to load community data');
      }
    } catch (err) {
      console.error('❌ Error loading issue frequencies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load community data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Transform backend data for display
   *
   * This function converts the raw API data into a format suitable
   * for our UI components.
   */
  const getDisplayStats = () => {
    if (!issueData) {
      // Fallback to minimal data if API fails
      return {
        totalPeople: 0,
        issueEngagement: selectedIssues.map(issueId => ({
          id: issueId,
          name: ISSUES.find(issue => issue.id === issueId)?.name || '',
          count: 0
        }))
      };
    }

    // TODO: Data Transformation Learning
    // Transform backend frequencies into display format
    return {
      totalPeople: issueData.total_users,
      issueEngagement: selectedIssues.map(issueId => ({
        id: issueId,
        name: ISSUES.find(issue => issue.id === issueId)?.name || '',
        count: issueData.frequencies[issueId] || 0
      }))
    };
  };

  // ========================================================================
  // REACT LIFECYCLE HOOKS
  // ========================================================================

  /**
   * Load issue data when component mounts
   *
   * This useEffect demonstrates the pattern for fetching data
   * when a component first loads.
   */
  useEffect(() => {
    fetchIssueData();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Refresh data when user's selected issues change
   *
   * This ensures we always show up-to-date data relevant to
   * the user's current selections.
   */
  useEffect(() => {
    if (selectedIssues.length > 0) {
      fetchIssueData();
    }
  }, [selectedIssues]); // Re-run when selectedIssues changes

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  /**
   * Manual refresh handler
   *
   * Allows users to refresh the community data if they want
   * to see the latest numbers.
   */
  const handleRefresh = () => {
    fetchIssueData();
  };

  // Get the processed data for display
  const displayStats = getDisplayStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={4} totalSteps={10} />
        
        <div className="text-center mb-8">
          <MascotGuide
            size="md"
            className="mb-6"
          />

          <SparkHeader
            title="You are not alone!"
            subtitle="People in your community care about solving these issues."
          />

          {/* TODO: Real-time Data Status */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Community data</span>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <>
                <span>•</span>
                <span>Updated {lastRefresh.toLocaleTimeString()}</span>
                <button
                  onClick={handleRefresh}
                  className="ml-2 p-1 hover:bg-accent/20 rounded"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* ================================================================ */}
        {/* ERROR STATE DISPLAY */}
        {/* ================================================================ */}

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-700 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-medium">Unable to Load Community Data</h3>
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* REAL COMMUNITY DATA DISPLAY */}
        {/* ================================================================ */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {displayStats.issueEngagement.slice(0, 3).map((issue, index) => {
            // TODO: Visual Engagement Indicator Learning
            // Calculate visual representation based on actual numbers
            const maxCount = Math.max(...displayStats.issueEngagement.map(i => i.count));
            const engagementLevel = maxCount > 0 ? Math.ceil((issue.count / maxCount) * 8) : 0;

            return (
              <div
                key={issue.id}
                className={`bg-card rounded-xl p-6 shadow-card text-center transition-all duration-300 ${
                  isLoading ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="mb-6">
                  <div className="w-full h-32 bg-civic/10 rounded-lg mb-3 flex items-center justify-center">
                    {/* TODO: Dynamic Visual Representation */}
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-civic" />
                    ) : (
                      <div className="flex space-x-1">
                        {[...Array(8)].map((_, i) => (
                          <Users
                            key={i}
                            className={`w-4 h-4 transition-colors duration-300 ${
                              i < engagementLevel ? 'text-civic' : 'text-civic/20'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  {issue.name}
                </h3>

                <div className="flex items-center justify-center mb-2">
                  {isLoading ? (
                    <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-3xl font-bold text-accent">
                      {issue.count.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  people in your community
                </p>
                <p className="text-sm text-muted-foreground">
                  care about this issue
                </p>

                {/* TODO: Real-time Update Indicator */}
                {!isLoading && issue.count > 0 && (
                  <div className="mt-2 flex items-center justify-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Live data</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="bg-accent/10 rounded-xl p-6 text-center mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to make an impact?
          </h3>
          <p className="text-muted-foreground mb-3">
            {displayStats.totalPeople > 0 ? (
              <>Join {displayStats.totalPeople.toLocaleString()} community members who have already engaged with these issues.</>
            ) : (
              <>You're helping to build a community of engaged citizens.</>
            )}
          </p>
          <p className="text-muted-foreground text-sm">
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
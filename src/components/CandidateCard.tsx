import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  isStarred: boolean;
  onToggleStar: (candidateId: string) => void;
  relevantIssues?: string[];
}

export const CandidateCard = ({ 
  candidate, 
  isStarred, 
  onToggleStar, 
  relevantIssues = [] 
}: CandidateCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-civic transition-all duration-300 relative">
      <button
        onClick={() => onToggleStar(candidate.id)}
        className={cn(
          'absolute top-4 right-4 p-2 rounded-full transition-all duration-300',
          isStarred 
            ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
            : 'bg-secondary text-muted-foreground hover:bg-accent/20 hover:text-accent'
        )}
        aria-label={isStarred ? 'Remove from ballot' : 'Add to ballot'}
      >
        <Star 
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            isStarred ? 'fill-current scale-110' : 'hover:scale-110'
          )} 
        />
      </button>
      
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-secondary rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={candidate.photo} 
            alt={candidate.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.name}`;
            }}
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {candidate.name}
          </h3>
          
          <Badge 
            variant="outline" 
            className={cn(
              'mb-3',
              candidate.party === 'Democratic' && 'border-blue-300 text-blue-700',
              candidate.party === 'Republican' && 'border-red-300 text-red-700',
              candidate.party === 'Independent' && 'border-green-300 text-green-700'
            )}
          >
            {candidate.party}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Key Positions
        </h4>
        
        <ul className="space-y-2">
          {candidate.positions.slice(0, 3).map((position, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-civic rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-card-foreground leading-relaxed">
                {position}
              </p>
            </li>
          ))}
        </ul>
      </div>
      
      {relevantIssues.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Addresses your issues:
          </p>
          <div className="flex flex-wrap gap-2">
            {relevantIssues.slice(0, 3).map(issue => (
              <Badge key={issue} variant="secondary" className="text-xs">
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button className="flex items-center space-x-2 text-sm text-civic hover:text-civic/80 transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span>Learn more</span>
        </button>
        
        {isStarred && (
          <span className="text-xs font-medium text-success">
            Added to your ballot
          </span>
        )}
      </div>
    </Card>
  );
};
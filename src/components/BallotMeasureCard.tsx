import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BallotMeasure } from '@/types';

interface BallotMeasureCardProps {
  measure: BallotMeasure;
  isStarred: boolean;
  onToggleStar: (measureId: string) => void;
}

export const BallotMeasureCard = ({ measure, isStarred, onToggleStar }: BallotMeasureCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-civic transition-all duration-300 relative">
      <button
        onClick={() => onToggleStar(measure.id)}
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
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {measure.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Ballot Measure
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-card-foreground mb-3 pr-12">
          {measure.title}
        </h3>
      </div>
      
      <div className="space-y-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
            What it does
          </h4>
          <p className="text-sm text-card-foreground leading-relaxed">
            {measure.description}
          </p>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-civic mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-card-foreground mb-1">
                Community Impact
              </h5>
              <p className="text-sm text-muted-foreground">
                {measure.impact}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-xs">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Yes</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="text-muted-foreground">No</span>
          </div>
        </div>
        
        {isStarred && (
          <span className="text-xs font-medium text-success">
            Added to your ballot
          </span>
        )}
      </div>
    </Card>
  );
};
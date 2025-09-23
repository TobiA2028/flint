import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Issue } from '@/types';

interface IssueCardProps {
  issue: Issue;
  isSelected: boolean;
  onSelect: (issueId: string) => void;
  disabled?: boolean;
}

export const IssueCard = ({ issue, isSelected, onSelect, disabled }: IssueCardProps) => {
  const IconComponent = Icons[issue.icon as keyof typeof Icons] as any;

  return (
    <Card 
      className={cn(
        'p-4 cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105',
        'border-2 relative overflow-hidden',
        isSelected 
          ? 'border-accent bg-accent/5 shadow-spark' 
          : 'border-border hover:border-accent/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onSelect(issue.id)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
          isSelected ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
        )}>
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>
        
        <div>
          <h3 className="font-semibold text-card-foreground mb-1">{issue.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{issue.description}</p>
        </div>
      </div>
    </Card>
  );
};
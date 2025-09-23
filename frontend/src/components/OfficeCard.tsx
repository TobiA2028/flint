import { Card } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface Office {
  id: string;
  name: string;
  description: string;
  explanation: string;
  level: 'local' | 'state' | 'federal';
}

interface OfficeCardProps {
  office: Office;
}

export const OfficeCard = ({ office }: OfficeCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-civic transition-shadow duration-300">
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
          
          <p className="text-sm text-card-foreground leading-relaxed">
            {office.explanation}
          </p>
        </div>
      </div>
    </Card>
  );
};
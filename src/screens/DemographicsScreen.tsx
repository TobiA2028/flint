import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/types';
import { MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SparkHeader } from '@/components/SparkHeader';

interface DemographicsScreenProps {
  userProfile: UserProfile;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
  onContinue: () => void;
}

const AGE_GROUPS = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55-64', label: '55-64' },
  { id: '65+', label: '65+' }
];

const COMMUNITY_ROLES = [
  { id: 'parent', label: 'Parent' },
  { id: 'student', label: 'Student' },
  { id: 'business_owner', label: 'Business Owner' },
  { id: 'renter', label: 'Renter' },
  { id: 'homeowner', label: 'Homeowner' },
  { id: 'commuter', label: 'Commuter' },
  { id: 'retiree', label: 'Retiree' },
  { id: 'first_time_voter', label: 'First-time Voter' },
  { id: 'volunteer', label: 'Community Volunteer' }
];

export const DemographicsScreen = ({ 
  userProfile, 
  onProfileUpdate, 
  onContinue 
}: DemographicsScreenProps) => {
  const canContinue = userProfile.ageGroup && userProfile.zipCode && userProfile.communityRole.length > 0;

  const handleAgeGroupSelect = (ageGroup: string) => {
    onProfileUpdate({ ageGroup });
  };

  const handleRoleToggle = (roleId: string) => {
    const currentRoles = userProfile.communityRole;
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter(id => id !== roleId)
      : [...currentRoles, roleId];
    
    onProfileUpdate({ communityRole: newRoles });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '').slice(0, 5);
    onProfileUpdate({ zipCode });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator currentStep={3} totalSteps={7} />
        
        <div className="text-center mb-8">
          <MascotGuide 
            size="md"
            className="mb-6"
          />
          
          <SparkHeader
            title="Who are you?"
            subtitle="Help us connect you to your local community and relevant issues."
          />
        </div>
        
        <div className="space-y-8">
          {/* Age Group */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Age Group</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => handleAgeGroupSelect(group.id)}
                  className={cn(
                  "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-civic focus:ring-offset-2",
                  userProfile.ageGroup === group.id
                    ? "border-civic bg-civic/5 text-civic"
                    : "border-border bg-card hover:border-civic/50"
                )}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Community Roles */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Which describes you? (Select all that apply)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {COMMUNITY_ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleToggle(role.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-civic focus:ring-offset-2",
                    userProfile.communityRole.includes(role.id)
                      ? "border-civic bg-civic/5 text-civic"
                      : "border-border bg-card hover:border-civic/50"
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* ZIP Code */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">ZIP Code</h3>
            <div className="relative max-w-xs">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="12345"
                value={userProfile.zipCode}
                onChange={handleZipCodeChange}
                className="pl-12 text-lg rounded-xl"
                maxLength={5}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              We use this to find your local elections and offices
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <CTAButton
            onClick={onContinue}
            disabled={!canContinue}
            variant={'civic'}
            className="min-w-[250px]"
          >
            Connect me to my Community
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
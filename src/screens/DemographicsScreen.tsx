import { useState } from 'react';
import { CTAButton } from '@/components/CTAButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { MascotGuide } from '@/components/MascotGuide';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';
import { MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemographicsScreenProps {
  userProfile: UserProfile;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
  onContinue: () => void;
}

const AGE_GROUPS = [
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-50', label: '36-50' },
  { id: '51-65', label: '51-65' },
  { id: '65+', label: '65+' }
];

const COMMUNITY_ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
  { id: 'business_owner', label: 'Small Business Owner' },
  { id: 'educator', label: 'Educator' },
  { id: 'healthcare', label: 'Healthcare Worker' },
  { id: 'retiree', label: 'Retiree' },
  { id: 'volunteer', label: 'Community Volunteer' },
  { id: 'artist', label: 'Artist/Creative' },
  { id: 'other', label: 'Other' }
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
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Who are you?
          </h1>
          
          <p className="text-muted-foreground">
            Help us connect you to your local community and relevant issues
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Age Group */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Age Group</h3>
            <div className="flex flex-wrap gap-3">
              {AGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => handleAgeGroupSelect(group.id)}
                  className={cn(
                    'px-4 py-2 rounded-full border-2 transition-all duration-200',
                    userProfile.ageGroup === group.id
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-accent/50'
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
              Community Role (select all that apply)
            </h3>
            <div className="flex flex-wrap gap-3">
              {COMMUNITY_ROLES.map(role => (
                <Badge
                  key={role.id}
                  variant={userProfile.communityRole.includes(role.id) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all duration-200 px-4 py-2',
                    userProfile.communityRole.includes(role.id)
                      ? 'bg-civic text-civic-foreground hover:bg-civic/90'
                      : 'hover:border-civic/50'
                  )}
                  onClick={() => handleRoleToggle(role.id)}
                >
                  {role.label}
                </Badge>
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
                className="pl-12 text-lg"
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
            variant={canContinue ? 'civic' : 'outline'}
            className="min-w-[250px]"
          >
            Connect Me to My Community
            <ArrowRight className="w-5 h-5 ml-2" />
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
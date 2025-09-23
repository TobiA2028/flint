import flintMascot from '@/assets/flint-mascot.png';

interface MascotGuideProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MascotGuide = ({ 
  size = 'md',
  className = ''
}: MascotGuideProps) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={sizes[size]}>
        <img 
          src={flintMascot} 
          alt="Flint mascot" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
interface SparkHeaderProps {
  title: string;
  subtitle?: string;
}

export function SparkHeader({ title, subtitle }: SparkHeaderProps) {
  return (
    <header className="text-center space-y-4 mb-8">
      
      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
        {title}
      </h1>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
}
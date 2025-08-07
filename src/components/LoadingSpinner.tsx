import React, { memo } from 'react';

export type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ size = 'medium', text }) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 
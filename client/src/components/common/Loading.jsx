import React from 'react';
import PropTypes from 'prop-types';

const variants = {
  spinner: ({ className = '', size = 'md' }) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };

    return (
      <div role="status" className={`${className} flex items-center justify-center`}>
        <svg
          className={`animate-spin ${sizes[size]} text-blue-500`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  },

  dots: ({ className = '', size = 'md' }) => {
    const sizes = {
      sm: 'h-1 w-1',
      md: 'h-2 w-2',
      lg: 'h-3 w-3',
    };

    return (
      <div role="status" className={`flex space-x-2 ${className}`} aria-label="Loading">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`${sizes[size]} bg-blue-500 rounded-full animate-bounce`}
            style={{ animationDelay: `${(dot - 1) * 0.15}s` }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
};

const Loading = ({ variant = 'spinner', size = 'md', className = '' }) => {
  const LoadingComponent = variants[variant];
  return <LoadingComponent size={size} className={className} />;
};

Loading.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'dots']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Loading;
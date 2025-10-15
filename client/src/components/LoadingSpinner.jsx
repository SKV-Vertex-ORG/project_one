import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={`${sizeClasses[size]} spinner`}></div>
      {text && (
        <p className="mt-4 text-white/60 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner

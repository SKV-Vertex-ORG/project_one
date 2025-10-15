import React from 'react'

const SimpleChart = ({ data, title, type = 'bar' }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/70">No data available for chart</p>
      </div>
    )
  }

  const entries = Object.entries(data).sort(([a], [b]) => new Date(a) - new Date(b))
  const maxValue = Math.max(...entries.map(([, value]) => value))

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {entries.map(([date, value]) => {
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          const formattedDate = new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
          
          return (
            <div key={date} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-white/70 text-right">
                {formattedDate}
              </div>
              <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    type === 'bar' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
                      : 'bg-gradient-to-r from-accent-500 to-primary-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                  ₹{value.toFixed(0)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <p className="text-sm text-white/70">
          Total: ₹{entries.reduce((sum, [, value]) => sum + value, 0).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default SimpleChart


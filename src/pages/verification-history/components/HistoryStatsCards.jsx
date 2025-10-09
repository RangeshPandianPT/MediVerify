import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoryStatsCards = ({ stats = {} }) => {
  const {
    totalVerifications = 0,
    genuinePercentage = 0,
    fakeDetected = 0,
    thisWeekCount = 0,
    averageConfidence = 0,
    lastVerification = null
  } = stats;

  const statsData = [
    {
      id: 'total',
      title: 'Total Verifications',
      value: totalVerifications,
      icon: 'Shield',
      color: 'primary',
      bgColor: 'bg-primary/10',
      description: 'All time scans'
    },
    {
      id: 'genuine',
      title: 'Genuine Medicines',
      value: `${genuinePercentage}%`,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      description: 'Authentic results'
    },
    {
      id: 'fake',
      title: 'Fake Detected',
      value: fakeDetected,
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error/10',
      description: 'Counterfeit found'
    },
    {
      id: 'weekly',
      title: 'This Week',
      value: thisWeekCount,
      icon: 'Calendar',
      color: 'accent',
      bgColor: 'bg-accent/10',
      description: 'Recent activity'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData?.map((stat) => (
        <div
          key={stat?.id}
          className={`${stat?.bgColor} border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-medical`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${stat?.color === 'primary' ? 'bg-primary/20' : 
                stat?.color === 'success' ? 'bg-success/20' : 
                stat?.color === 'error' ? 'bg-error/20' : 'bg-accent/20'}
            `}>
              <Icon 
                name={stat?.icon} 
                size={20} 
                color={`var(--color-${stat?.color})`} 
              />
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                stat?.color === 'primary' ? 'text-primary' : 
                stat?.color === 'success' ? 'text-success' : 
                stat?.color === 'error' ? 'text-error' : 'text-accent'
              }`}>
                {stat?.value}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">
              {stat?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stat?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryStatsCards;
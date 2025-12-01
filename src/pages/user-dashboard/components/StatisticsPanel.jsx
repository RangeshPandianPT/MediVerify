import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsPanel = ({ className = '' }) => {
  const userStats = {
    totalVerifications: 47,
    authenticMedicines: 41,
    fakesDetected: 6,
    trustScore: 94,
    monthlyVerifications: 12,
    savedFromFakes: 6
  };

  const statCards = [
    {
      id: 'total',
      label: 'Total Verifications',
      value: userStats?.totalVerifications,
      icon: 'Shield',
      color: 'primary',
      bgColor: 'bg-primary/10',
      change: '+3 this week',
      changeType: 'positive'
    },
    {
      id: 'authentic',
      label: 'Genuine Medicines',
      value: userStats?.authenticMedicines,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      change: `${Math.round((userStats?.authenticMedicines / userStats?.totalVerifications) * 100)}% authentic`,
      changeType: 'neutral'
    },
    {
      id: 'fakes',
      label: 'Fakes Detected',
      value: userStats?.fakesDetected,
      icon: 'AlertTriangle',
      color: 'error',
      bgColor: 'bg-error/10',
      change: 'Potentially harmful',
      changeType: 'warning'
    },
    {
      id: 'trust',
      label: 'Trust Score',
      value: `${userStats?.trustScore}%`,
      icon: 'Award',
      color: 'accent',
      bgColor: 'bg-accent/10',
      change: 'Excellent rating',
      changeType: 'positive'
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'warning': return 'text-warning';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Your Impact</h3>
        <p className="text-sm text-muted-foreground">
          Your contribution to medicine safety in India
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards?.map((stat) => (
          <div
            key={stat?.id}
            className={`${stat?.bgColor} border border-${stat?.color}/20 rounded-xl p-4 hover:shadow-medical transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat?.color}/20 rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={20} color={`var(--color-${stat?.color})`} />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold text-${stat?.color}`}>
                  {stat?.value}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {stat?.label}
              </h4>
              <p className={`text-xs ${getChangeColor(stat?.changeType)}`}>
                {stat?.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Insights */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={18} className="mr-2" color="var(--color-primary)" />
          Monthly Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-primary mb-1">
              {userStats?.monthlyVerifications}
            </div>
            <div className="text-sm text-muted-foreground">
              Verifications this month
            </div>
          </div>
          
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-lg font-bold text-success mb-1">
              ₹{userStats?.savedFromFakes * 150}
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated savings from avoiding fakes
            </div>
          </div>
          
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <div className="text-lg font-bold text-accent mb-1">
              {userStats?.savedFromFakes}
            </div>
            <div className="text-sm text-muted-foreground">
              Family members protected
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">
                Community Impact
              </p>
              <p className="text-xs text-muted-foreground">
                Your verifications contribute to a safer medicine ecosystem. 
                Every scan helps build our AI's accuracy for protecting all Indian families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
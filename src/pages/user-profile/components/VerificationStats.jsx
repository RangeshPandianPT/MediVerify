import React from 'react';
import Icon from '../../../components/AppIcon';

const VerificationStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Verifications',
      value: stats?.totalVerifications || 0,
      icon: 'Shield',
      color: 'primary',
      bgColor: 'bg-primary/10',
      description: 'Medicines scanned'
    },
    {
      title: 'Authentic Medicines',
      value: stats?.authenticCount || 0,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      description: 'Verified as genuine'
    },
    {
      title: 'Fake Detected',
      value: stats?.fakeCount || 0,
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error/10',
      description: 'Counterfeit identified'
    },
    {
      title: 'Community Impact',
      value: stats?.communityImpact || 0,
      icon: 'Users',
      color: 'accent',
      bgColor: 'bg-accent/10',
      description: 'People protected'
    }
  ];

  const accuracyRate = stats?.totalVerifications > 0 
    ? Math.round((stats?.authenticCount / stats?.totalVerifications) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Verification Statistics</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} />
          <span>Last 30 days</span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className={`${stat?.bgColor} border border-border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} color={`var(--color-${stat?.color})`} />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold text-${stat?.color}`}>
                  {stat?.value?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">{stat?.title}</h3>
              <p className="text-xs text-muted-foreground">{stat?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Accuracy Meter */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Verification Accuracy</h3>
          <span className="text-2xl font-bold text-success">{accuracyRate}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <div 
            className="bg-success h-3 rounded-full transition-all duration-1000"
            style={{ width: `${accuracyRate}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-foreground">{stats?.weeklyAverage || 0}</div>
            <div className="text-muted-foreground">Weekly Avg</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">{stats?.monthlyGrowth || 0}%</div>
            <div className="text-muted-foreground">Growth</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">#{stats?.userRank || 'N/A'}</div>
            <div className="text-muted-foreground">Community Rank</div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity?.type === 'authentic' ? 'bg-success/20' : 
                activity?.type === 'fake' ? 'bg-error/20' : 'bg-warning/20'
              }`}>
                <Icon 
                  name={activity?.type === 'authentic' ? 'CheckCircle' : 
                        activity?.type === 'fake' ? 'XCircle' : 'AlertTriangle'} 
                  size={16} 
                  color={`var(--color-${activity?.type === 'authentic' ? 'success' : 
                                      activity?.type === 'fake' ? 'error' : 'warning'})`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity?.medicine}</p>
                <p className="text-xs text-muted-foreground">{activity?.date}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {activity?.confidence}% confidence
              </div>
            </div>
          )) || (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationStats;
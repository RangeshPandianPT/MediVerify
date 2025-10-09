import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecurityPanel = ({ securityData, onUpdateSecurity }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securityData?.twoFactorEnabled || false);

  const loginHistory = [
    {
      id: 1,
      device: "iPhone 14 Pro",
      location: "Mumbai, Maharashtra",
      ip: "203.192.xxx.xxx",
      date: "2025-10-09 14:30",
      status: "success"
    },
    {
      id: 2,
      device: "Chrome Browser",
      location: "Mumbai, Maharashtra", 
      ip: "203.192.xxx.xxx",
      date: "2025-10-08 09:15",
      status: "success"
    },
    {
      id: 3,
      device: "Android App",
      location: "Delhi, Delhi",
      ip: "106.51.xxx.xxx",
      date: "2025-10-07 18:45",
      status: "failed"
    },
    {
      id: 4,
      device: "Chrome Browser",
      location: "Mumbai, Maharashtra",
      ip: "203.192.xxx.xxx",
      date: "2025-10-06 11:20",
      status: "success"
    }
  ];

  const handlePasswordChange = () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    onUpdateSecurity?.({
      type: 'password_change',
      data: passwordData
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    onUpdateSecurity?.({
      type: 'two_factor',
      enabled: !twoFactorEnabled
    });
  };

  const getDeviceIcon = (device) => {
    if (device?.includes('iPhone') || device?.includes('iOS')) return 'Smartphone';
    if (device?.includes('Android')) return 'Smartphone';
    if (device?.includes('Chrome') || device?.includes('Browser')) return 'Monitor';
    return 'Laptop';
  };

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Lock" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-foreground">Password Security</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            iconName="Edit2"
            iconPosition="left"
          >
            Change Password
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span className="text-sm text-foreground">Password last changed 30 days ago</span>
          </div>

          {showPasswordForm && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Input
                type="password"
                label="Current Password"
                value={passwordData?.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e?.target?.value})}
                placeholder="Enter current password"
              />
              <Input
                type="password"
                label="New Password"
                value={passwordData?.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e?.target?.value})}
                placeholder="Enter new password"
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={passwordData?.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e?.target?.value})}
                placeholder="Confirm new password"
              />
              <div className="flex space-x-3">
                <Button onClick={handlePasswordChange} iconName="Check" iconPosition="left">
                  Update Password
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            twoFactorEnabled 
              ? 'bg-success/20 text-success' :'bg-warning/20 text-warning'
          }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </p>

          <Checkbox
            label="Enable Two-Factor Authentication"
            description="Receive verification codes via SMS or authenticator app"
            checked={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
          />

          {twoFactorEnabled && (
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">2FA Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Backup codes: 8 remaining • Last used: Never
              </p>
              <div className="flex space-x-3 mt-3">
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                  Download Backup Codes
                </Button>
                <Button variant="outline" size="sm" iconName="Smartphone" iconPosition="left">
                  Setup Authenticator
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Login History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-foreground">Login History</h3>
          </div>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export History
          </Button>
        </div>

        <div className="space-y-3">
          {loginHistory?.map((login) => (
            <div key={login?.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                login?.status === 'success' ? 'bg-success/20' : 'bg-error/20'
              }`}>
                <Icon 
                  name={getDeviceIcon(login?.device)} 
                  size={16} 
                  color={`var(--color-${login?.status === 'success' ? 'success' : 'error'})`}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground text-sm">{login?.device}</span>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                    login?.status === 'success' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                  }`}>
                    {login?.status}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>{login?.location}</span>
                  <span>•</span>
                  <span>{login?.ip}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-right">
                {new Date(login.date)?.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Security Notice</p>
              <p className="text-muted-foreground">
                If you notice any suspicious login attempts, change your password immediately and enable 2FA.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Contacts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Phone" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Emergency Contacts</h3>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Configure emergency contacts for account recovery and fake medicine reporting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Emergency Email"
              type="email"
              placeholder="emergency@example.com"
              value={securityData?.emergencyEmail || ''}
            />
            <Input
              label="Emergency Phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={securityData?.emergencyPhone || ''}
            />
          </div>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <h4 className="font-medium text-error mb-2">Quick Report Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-medium">Poison Control</p>
                <p className="text-muted-foreground">1800-11-2120</p>
              </div>
              <div>
                <p className="font-medium">FDA Helpline</p>
                <p className="text-muted-foreground">1800-11-0016</p>
              </div>
              <div>
                <p className="font-medium">Emergency</p>
                <p className="text-muted-foreground">112</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="bg-error/5 border border-error/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Trash2" size={20} color="var(--color-error)" />
          <h3 className="font-semibold text-error">Delete Account</h3>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          <div className="bg-error/10 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">What will be deleted:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All verification history and results</li>
              <li>• Personal profile information</li>
              <li>• Settings and preferences</li>
              <li>• Community contributions</li>
            </ul>
          </div>

          <Button
            variant="outline"
            className="border-error text-error hover:bg-error hover:text-error-foreground"
            iconName="AlertTriangle"
            iconPosition="left"
          >
            Request Account Deletion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;
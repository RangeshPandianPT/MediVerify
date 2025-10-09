import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileHeader = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-medical">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-medical">
            <Icon name="Camera" size={16} color="var(--color-accent-foreground)" />
          </button>
        </div>

        {/* Profile Information */}
        <div className="flex-1 w-full md:w-auto">
          {!isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  iconName="Edit2"
                  iconPosition="left"
                >
                  Edit Profile
                </Button>
              </div>
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.phone && (
                <p className="text-muted-foreground flex items-center">
                  <Icon name="Phone" size={16} className="mr-2" />
                  {user?.phone}
                </p>
              )}
              {user?.location && (
                <p className="text-muted-foreground flex items-center">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  {user?.location}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
                <span className="flex items-center">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  Joined {new Date(user.joinDate)?.toLocaleDateString('en-IN')}
                </span>
                <span className="flex items-center">
                  <Icon name="Shield" size={14} className="mr-1" />
                  Verified Member
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={editData?.name}
                  onChange={(e) => setEditData({ ...editData, name: e?.target?.value })}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={editData?.email}
                  onChange={(e) => setEditData({ ...editData, email: e?.target?.value })}
                  placeholder="Enter your email"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={editData?.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e?.target?.value })}
                  placeholder="Enter your phone number"
                />
                <Input
                  label="Location"
                  value={editData?.location}
                  onChange={(e) => setEditData({ ...editData, location: e?.target?.value })}
                  placeholder="Enter your city, state"
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSave} iconName="Check" iconPosition="left">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
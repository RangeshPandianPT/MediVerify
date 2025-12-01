import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmergencyContactsPanel = ({ contacts, onUpdateContacts }) => {
  const [emergencyContacts, setEmergencyContacts] = useState(contacts || [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      relationship: "family_doctor",
      phone: "+91 98765 43210",
      email: "dr.rajesh@clinic.com",
      priority: 1
    },
    {
      id: 2,
  name: "RANGESH",
      relationship: "spouse",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      priority: 2
    }
  ]);

  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    priority: emergencyContacts?.length + 1
  });

  const relationshipOptions = [
    { value: 'family_doctor', label: 'Family Doctor' },
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Close Friend' },
    { value: 'caregiver', label: 'Caregiver' },
    { value: 'other', label: 'Other' }
  ];

  const emergencyNumbers = [
    {
      title: "National Emergency",
      number: "112",
      description: "All emergency services",
      icon: "Phone"
    },
    {
      title: "Poison Control Center",
      number: "1800-11-2120",
      description: "24/7 poison emergency helpline",
      icon: "AlertTriangle"
    },
    {
      title: "FDA Drug Safety",
      number: "1800-11-0016",
      description: "Report adverse drug reactions",
      icon: "Shield"
    },
    {
      title: "Medical Emergency",
      number: "108",
      description: "Ambulance and medical emergency",
      icon: "Truck"
    }
  ];

  const handleAddContact = () => {
    if (!newContact?.name || !newContact?.phone) {
      alert('Name and phone number are required');
      return;
    }

    const contactToAdd = {
      ...newContact,
      id: Date.now()
    };

    const updatedContacts = [...emergencyContacts, contactToAdd];
    setEmergencyContacts(updatedContacts);
    onUpdateContacts?.(updatedContacts);

    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      priority: updatedContacts?.length + 1
    });
    setIsAddingContact(false);
  };

  const handleRemoveContact = (id) => {
    const updatedContacts = emergencyContacts?.filter(contact => contact?.id !== id);
    setEmergencyContacts(updatedContacts);
    onUpdateContacts?.(updatedContacts);
  };

  const handleQuickCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const getRelationshipIcon = (relationship) => {
    switch (relationship) {
      case 'family_doctor': return 'Stethoscope';
      case 'spouse': return 'Heart';
      case 'parent': case 'child': return 'Users';
      case 'sibling': return 'UserPlus';
      case 'caregiver': return 'Shield';
      default: return 'User';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Emergency Numbers */}
      <div className="bg-error/5 border border-error/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Phone" size={20} color="var(--color-error)" />
          <h3 className="font-semibold text-error">Emergency Hotlines</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyNumbers?.map((emergency, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={emergency?.icon} size={16} color="var(--color-error)" />
                  <h4 className="font-medium text-foreground">{emergency?.title}</h4>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickCall(emergency?.number)}
                  className="border-error text-error hover:bg-error hover:text-error-foreground"
                  iconName="Phone"
                />
              </div>
              <p className="text-lg font-bold text-error mb-1">{emergency?.number}</p>
              <p className="text-xs text-muted-foreground">{emergency?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Personal Emergency Contacts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-foreground">Personal Emergency Contacts</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingContact(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Contact
          </Button>
        </div>

        {/* Existing Contacts */}
        <div className="space-y-3 mb-6">
          {emergencyContacts?.map((contact) => (
            <div key={contact?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Icon 
                  name={getRelationshipIcon(contact?.relationship)} 
                  size={20} 
                  color="var(--color-primary)" 
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{contact?.name}</h4>
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                    Priority {contact?.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {contact?.relationship?.replace('_', ' ')}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center">
                    <Icon name="Phone" size={12} className="mr-1" />
                    {contact?.phone}
                  </span>
                  {contact?.email && (
                    <span className="flex items-center">
                      <Icon name="Mail" size={12} className="mr-1" />
                      {contact?.email}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickCall(contact?.phone)}
                  iconName="Phone"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveContact(contact?.id)}
                  className="text-error hover:text-error hover:bg-error/10"
                  iconName="Trash2"
                />
              </div>
            </div>
          ))}

          {emergencyContacts?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Users" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
              <p className="text-muted-foreground">No emergency contacts added yet</p>
              <p className="text-sm text-muted-foreground">Add trusted contacts for emergencies</p>
            </div>
          )}
        </div>

        {/* Add New Contact Form */}
        {isAddingContact && (
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Add Emergency Contact</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={newContact?.name}
                  onChange={(e) => setNewContact({...newContact, name: e?.target?.value})}
                  placeholder="Enter contact name"
                />
                <Select
                  label="Relationship"
                  required
                  options={relationshipOptions}
                  value={newContact?.relationship}
                  onChange={(value) => setNewContact({...newContact, relationship: value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={newContact?.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e?.target?.value})}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={newContact?.email}
                  onChange={(e) => setNewContact({...newContact, email: e?.target?.value})}
                  placeholder="contact@email.com"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleAddContact} iconName="Check" iconPosition="left">
                  Add Contact
                </Button>
                <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Medicine Safety Tips */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          <h3 className="font-semibold text-foreground">Medicine Emergency Guidelines</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="font-medium text-warning mb-2">If You Suspect Fake Medicine:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Stop taking the medicine immediately</li>
              <li>Contact your doctor or pharmacist</li>
              <li>Report through MediVerify emergency feature</li>
              <li>Keep the medicine packaging for investigation</li>
              <li>Monitor for any adverse reactions</li>
            </ol>
          </div>

          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <h4 className="font-medium text-error mb-2">Adverse Reaction Emergency:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Call emergency services (112) immediately</li>
              <li>Contact poison control (1800-11-2120)</li>
              <li>Inform about the suspected fake medicine</li>
              <li>Provide medicine details and batch number</li>
              <li>Follow emergency responder instructions</li>
            </ol>
          </div>

          <Button
            variant="outline"
            className="w-full border-error text-error hover:bg-error hover:text-error-foreground"
            iconName="AlertTriangle"
            iconPosition="left"
          >
            Report Medicine Emergency
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsPanel;
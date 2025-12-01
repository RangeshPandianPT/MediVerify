import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';

const HistoryFilterPanel = ({ 
  isOpen = false,
  onToggle,
  filters = {},
  onFiltersChange,
  totalResults = 0,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    dateRange: 'all',
    status: 'all',
    authenticity: 'all',
    sortBy: 'date_desc',
    ...filters
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' }
  ];

  const authenticityOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'authentic', label: 'Authentic Only' },
    { value: 'fake', label: 'Fake Detected' },
    { value: 'suspicious', label: 'Suspicious' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'confidence_desc', label: 'Highest Confidence' },
    { value: 'confidence_asc', label: 'Lowest Confidence' },
    { value: 'name_asc', label: 'Medicine Name A-Z' },
    { value: 'name_desc', label: 'Medicine Name Z-A' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      dateRange: 'all',
      status: 'all',
      authenticity: 'all',
      sortBy: 'date_desc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters = () => {
    return localFilters?.search || 
           localFilters?.dateRange !== 'all' || 
           localFilters?.status !== 'all' || 
           localFilters?.authenticity !== 'all' ||
           localFilters?.sortBy !== 'date_desc';
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-between"
          iconName="Filter"
          iconPosition="left"
        >
          <span>Filters {hasActiveFilters() && '(Active)'}</span>
          <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </Button>
      </div>
      {/* Filter Panel */}
      <div className={`
        ${className}
        md:block
        ${isOpen ? 'block' : 'hidden md:block'}
      `}>
        <div className="bg-card border border-border rounded-xl p-6 shadow-medical">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} color="var(--color-primary)" />
              <h3 className="font-semibold text-foreground">Filter Results</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {totalResults} results
              </span>
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              type="search"
              label="Search Medicines"
              placeholder="Search by medicine name, batch number..."
              value={localFilters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="mb-0"
            />
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={localFilters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
            
            {localFilters?.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input
                  type="date"
                  label="From"
                  value={localFilters?.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To"
                  value={localFilters?.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                />
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <Select
              label="Verification Status"
              options={statusOptions}
              value={localFilters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Authenticity Filter */}
          <div className="mb-6">
            <Select
              label="Authenticity Result"
              options={authenticityOptions}
              value={localFilters?.authenticity}
              onChange={(value) => handleFilterChange('authenticity', value)}
            />
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <Select
              label="Sort By"
              options={sortOptions}
              value={localFilters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>

          {/* Advanced Filters */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Advanced Options</h4>
            
            <div className="space-y-3">
              <Checkbox
                label="Show only flagged medicines"
                description="Display medicines marked for review"
                checked={localFilters?.flaggedOnly || false}
                onChange={(e) => handleFilterChange('flaggedOnly', e?.target?.checked)}
              />
              
              <Checkbox
                label="Include shared verifications"
                description="Show verifications shared with you"
                checked={localFilters?.includeShared || false}
                onChange={(e) => handleFilterChange('includeShared', e?.target?.checked)}
              />
              
              <Checkbox
                label="High confidence only"
                description="Show results with >90% confidence"
                checked={localFilters?.highConfidenceOnly || false}
                onChange={(e) => handleFilterChange('highConfidenceOnly', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="border-t border-border pt-6 mt-6">
            <h4 className="font-medium text-foreground mb-4">Export Data</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="text-sm"
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                className="text-sm"
              >
                PDF Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border-t border-border pt-6 mt-6">
            <h4 className="font-medium text-foreground mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-success/10 rounded-lg p-3">
                <div className="text-lg font-bold text-success">87%</div>
                <div className="text-xs text-muted-foreground">Authentic</div>
              </div>
              <div className="bg-error/10 rounded-lg p-3">
                <div className="text-lg font-bold text-error">13%</div>
                <div className="text-xs text-muted-foreground">Suspicious</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryFilterPanel;
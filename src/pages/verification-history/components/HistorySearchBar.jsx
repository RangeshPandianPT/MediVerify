import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const HistorySearchBar = ({ 
  onSearch, 
  onSort, 
  searchValue = '', 
  sortValue = 'date_desc',
  totalResults = 0,
  className = '' 
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'confidence_desc', label: 'Highest Confidence' },
    { value: 'confidence_asc', label: 'Lowest Confidence' },
    { value: 'name_asc', label: 'Medicine Name A-Z' },
    { value: 'name_desc', label: 'Medicine Name Z-A' },
    { value: 'status_authentic', label: 'Authentic First' },
    { value: 'status_fake', label: 'Fake First' }
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch?.('');
  };

  const handleQuickFilter = (filter) => {
    switch (filter) {
      case 'today': setLocalSearch('today');
        break;
      case 'authentic': setLocalSearch('authentic');
        break;
      case 'fake': setLocalSearch('fake');
        break;
      case 'high_confidence': onSort?.('confidence_desc');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-4 ${className}`}>
      {/* Main Search Row */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search medicines, batch numbers, or verification IDs..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e?.target?.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="w-48">
          <Select
            options={sortOptions}
            value={sortValue}
            onChange={onSort}
            placeholder="Sort by..."
            className="text-sm"
          />
        </div>

        {/* Advanced Search Toggle */}
        <Button
          variant="outline"
          size="sm"
          iconName="SlidersHorizontal"
          className="hidden md:flex"
        >
          Filters
        </Button>
      </div>
      {/* Quick Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Quick filters:</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleQuickFilter('today')}
              className="text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleQuickFilter('authentic')}
              className="text-xs text-success hover:bg-success/10"
            >
              Authentic
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleQuickFilter('fake')}
              className="text-xs text-error hover:bg-error/10"
            >
              Fake
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleQuickFilter('high_confidence')}
              className="text-xs"
            >
              High Confidence
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Database" size={12} />
          <span>{totalResults} results</span>
        </div>
      </div>
      {/* Search Suggestions (when focused) */}
      {isSearchFocused && localSearch?.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-medical-lg max-h-48 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2">Search suggestions:</div>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-foreground">
                Search in medicine names
              </button>
              <button className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-foreground">
                Search in batch numbers
              </button>
              <button className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-foreground">
                Search in verification IDs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySearchBar;
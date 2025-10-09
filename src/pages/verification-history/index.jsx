import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HistoryFilterPanel from '../../components/ui/HistoryFilterPanel';
import EmergencyReportingModal from '../../components/ui/EmergencyReportingModal';
import HistoryStatsCards from './components/HistoryStatsCards';
import HistoryListItem from './components/HistoryListItem';
import BulkActionsBar from './components/BulkActionsBar';
import HistorySearchBar from './components/HistorySearchBar';
import EmptyHistoryState from './components/EmptyHistoryState';

import Button from '../../components/ui/Button';

const VerificationHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'date_desc');
  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    dateRange: searchParams?.get('dateRange') || 'all',
    status: searchParams?.get('status') || 'all',
    authenticity: searchParams?.get('authenticity') || 'all',
    sortBy: searchParams?.get('sort') || 'date_desc'
  });

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210"
  };

  // Mock verification history data
  const mockVerifications = [
    {
      id: 1,
      verificationId: "MV-2024-001",
      medicineName: "Paracetamol 500mg",
      medicineImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      verificationDate: "2024-10-09T10:30:00Z",
      credibilityPercentage: 98,
      isAuthentic: true,
      status: "completed",
      batchNumber: "PCM500-2024-A",
      manufacturer: "Sun Pharmaceutical Industries Ltd.",
      expiryDate: "2026-08-15",
      analysisDetails: {
        fontMatch: 98,
        colorMatch: 96,
        textureMatch: 99,
        overallScore: 98
      }
    },
    {
      id: 2,
      verificationId: "MV-2024-002",
      medicineName: "Amoxicillin 250mg",
      medicineImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      verificationDate: "2024-10-08T15:45:00Z",
      credibilityPercentage: 23,
      isAuthentic: false,
      status: "completed",
      batchNumber: "AMX250-2024-B",
      manufacturer: "Unknown/Suspicious",
      expiryDate: "2025-12-20",
      analysisDetails: {
        fontMatch: 45,
        colorMatch: 32,
        textureMatch: 12,
        overallScore: 23
      }
    },
    {
      id: 3,
      verificationId: "MV-2024-003",
      medicineName: "Crocin Advance",
      medicineImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
      verificationDate: "2024-10-07T09:15:00Z",
      credibilityPercentage: 94,
      isAuthentic: true,
      status: "completed",
      batchNumber: "CRC-ADV-2024",
      manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd.",
      expiryDate: "2026-03-10",
      analysisDetails: {
        fontMatch: 95,
        colorMatch: 94,
        textureMatch: 93,
        overallScore: 94
      }
    },
    {
      id: 4,
      verificationId: "MV-2024-004",
      medicineName: "Azithromycin 500mg",
      medicineImage: "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400",
      verificationDate: "2024-10-06T14:20:00Z",
      credibilityPercentage: 67,
      isAuthentic: null,
      status: "completed",
      batchNumber: "AZI500-2024-C",
      manufacturer: "Cipla Ltd.",
      expiryDate: "2025-11-30",
      analysisDetails: {
        fontMatch: 72,
        colorMatch: 65,
        textureMatch: 64,
        overallScore: 67
      }
    },
    {
      id: 5,
      verificationId: "MV-2024-005",
      medicineName: "Dolo 650mg",
      medicineImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
      verificationDate: "2024-10-05T11:30:00Z",
      credibilityPercentage: 91,
      isAuthentic: true,
      status: "completed",
      batchNumber: "DLO650-2024-D",
      manufacturer: "Micro Labs Ltd.",
      expiryDate: "2026-01-25",
      analysisDetails: {
        fontMatch: 92,
        colorMatch: 89,
        textureMatch: 92,
        overallScore: 91
      }
    },
    {
      id: 6,
      verificationId: "MV-2024-006",
      medicineName: "Processing...",
      medicineImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      verificationDate: "2024-10-09T16:00:00Z",
      credibilityPercentage: 0,
      isAuthentic: null,
      status: "processing",
      batchNumber: "Analyzing...",
      manufacturer: "Analyzing...",
      expiryDate: null,
      analysisDetails: {}
    }
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    const completedVerifications = mockVerifications?.filter(v => v?.status === 'completed');
    const authenticCount = completedVerifications?.filter(v => v?.isAuthentic === true)?.length;
    const fakeCount = completedVerifications?.filter(v => v?.isAuthentic === false)?.length;
    const thisWeekCount = mockVerifications?.filter(v => {
      const verificationDate = new Date(v.verificationDate);
      const weekAgo = new Date();
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      return verificationDate >= weekAgo;
    })?.length;

    return {
      totalVerifications: mockVerifications?.length,
      genuinePercentage: completedVerifications?.length > 0 
        ? Math.round((authenticCount / completedVerifications?.length) * 100) 
        : 0,
      fakeDetected: fakeCount,
      thisWeekCount,
      averageConfidence: completedVerifications?.length > 0
        ? Math.round(completedVerifications?.reduce((sum, v) => sum + v?.credibilityPercentage, 0) / completedVerifications?.length)
        : 0,
      lastVerification: mockVerifications?.[0]?.verificationDate
    };
  }, [mockVerifications]);

  // Filter and sort verifications
  const filteredVerifications = useMemo(() => {
    let filtered = [...mockVerifications];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(v => 
        v?.medicineName?.toLowerCase()?.includes(query) ||
        v?.verificationId?.toLowerCase()?.includes(query) ||
        v?.batchNumber?.toLowerCase()?.includes(query) ||
        v?.manufacturer?.toLowerCase()?.includes(query)
      );
    }

    // Apply authenticity filter
    if (filters?.authenticity !== 'all') {
      switch (filters?.authenticity) {
        case 'authentic':
          filtered = filtered?.filter(v => v?.isAuthentic === true);
          break;
        case 'fake':
          filtered = filtered?.filter(v => v?.isAuthentic === false);
          break;
        case 'suspicious':
          filtered = filtered?.filter(v => v?.isAuthentic === null && v?.status === 'completed');
          break;
      }
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(v => v?.status === filters?.status);
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters?.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        filtered = filtered?.filter(v => new Date(v.verificationDate) >= startDate);
      }
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.verificationDate) - new Date(b.verificationDate);
        case 'date_desc':
          return new Date(b.verificationDate) - new Date(a.verificationDate);
        case 'confidence_desc':
          return b?.credibilityPercentage - a?.credibilityPercentage;
        case 'confidence_asc':
          return a?.credibilityPercentage - b?.credibilityPercentage;
        case 'name_asc':
          return a?.medicineName?.localeCompare(b?.medicineName);
        case 'name_desc':
          return b?.medicineName?.localeCompare(a?.medicineName);
        case 'status_authentic':
          return (b?.isAuthentic === true ? 1 : 0) - (a?.isAuthentic === true ? 1 : 0);
        case 'status_fake':
          return (b?.isAuthentic === false ? 1 : 0) - (a?.isAuthentic === false ? 1 : 0);
        default:
          return new Date(b.verificationDate) - new Date(a.verificationDate);
      }
    });

    return filtered;
  }, [mockVerifications, searchQuery, filters, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params?.set('search', searchQuery);
    if (sortBy !== 'date_desc') params?.set('sort', sortBy);
    if (filters?.dateRange !== 'all') params?.set('dateRange', filters?.dateRange);
    if (filters?.status !== 'all') params?.set('status', filters?.status);
    if (filters?.authenticity !== 'all') params?.set('authenticity', filters?.authenticity);
    
    setSearchParams(params);
  }, [searchQuery, sortBy, filters, setSearchParams]);

  // Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters?.search || '');
    setSortBy(newFilters?.sortBy || 'date_desc');
  };

  const handleSelectItem = (id, isSelected) => {
    const newSelected = new Set(selectedItems);
    if (isSelected) {
      newSelected?.add(id);
    } else {
      newSelected?.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(filteredVerifications.map(v => v.id)));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedItems?.size} selected verification records?`)) {
      // In a real app, this would make an API call
      console.log('Deleting items:', Array.from(selectedItems));
      setSelectedItems(new Set());
    }
  };

  const handleBulkExport = (format = 'csv') => {
    const selectedVerifications = filteredVerifications?.filter(v => selectedItems?.has(v?.id));
    console.log(`Exporting ${selectedVerifications?.length} items as ${format}:`, selectedVerifications);
    
    // Mock export functionality
    const exportData = selectedVerifications?.map(v => ({
      'Verification ID': v?.verificationId,
      'Medicine Name': v?.medicineName,
      'Date': new Date(v.verificationDate)?.toLocaleDateString('en-IN'),
      'Confidence': `${v?.credibilityPercentage}%`,
      'Status': v?.isAuthentic === true ? 'Authentic' : v?.isAuthentic === false ? 'Fake' : 'Suspicious',
      'Batch Number': v?.batchNumber,
      'Manufacturer': v?.manufacturer
    }));
    
    console.log('Export data:', exportData);
  };

  const handleBulkShare = () => {
    const selectedVerifications = filteredVerifications?.filter(v => selectedItems?.has(v?.id));
    console.log('Sharing items:', selectedVerifications);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this verification record?')) {
      console.log('Deleting item:', id);
    }
  };

  const handleShareItem = (verification) => {
    console.log('Sharing verification:', verification);
  };

  const handleReVerify = (verification) => {
    navigate('/medicine-verification', { 
      state: { 
        reVerifyData: {
          previousId: verification?.id,
          medicineName: verification?.medicineName,
          batchNumber: verification?.batchNumber
        }
      }
    });
  };

  const handleClearFilters = () => {
    const resetFilters = {
      search: '',
      dateRange: 'all',
      status: 'all',
      authenticity: 'all',
      sortBy: 'date_desc'
    };
    setFilters(resetFilters);
    setSearchQuery('');
    setSortBy('date_desc');
  };

  const handleEmergencyReport = (reportData) => {
    console.log('Emergency report submitted:', reportData);
    setIsEmergencyModalOpen(false);
  };

  const hasActiveFilters = searchQuery || 
    filters?.dateRange !== 'all' || 
    filters?.status !== 'all' || 
    filters?.authenticity !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser} 
        verificationCount={stats?.totalVerifications}
        hasUnreadResults={false}
      />
      <div className="content-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Verification History
              </h1>
              <p className="text-muted-foreground">
                Track and manage all your medicine authenticity verifications
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEmergencyModalOpen(true)}
                iconName="AlertTriangle"
                iconPosition="left"
                className="text-error border-error hover:bg-error hover:text-error-foreground"
              >
                Report Fake
              </Button>
              
              <Button
                onClick={() => navigate('/medicine-verification')}
                iconName="Camera"
                iconPosition="left"
              >
                New Verification
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <HistoryStatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <HistoryFilterPanel
                isOpen={isFilterPanelOpen}
                onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                totalResults={filteredVerifications?.length}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Sort */}
              <HistorySearchBar
                onSearch={handleSearch}
                onSort={handleSort}
                searchValue={searchQuery}
                sortValue={sortBy}
                totalResults={filteredVerifications?.length}
                className="mb-6"
              />

              {/* Bulk Actions */}
              <BulkActionsBar
                selectedCount={selectedItems?.size}
                totalCount={filteredVerifications?.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkShare={handleBulkShare}
                isVisible={selectedItems?.size > 0}
              />

              {/* Verification List */}
              {filteredVerifications?.length === 0 ? (
                <EmptyHistoryState
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="space-y-4">
                  {filteredVerifications?.map((verification) => (
                    <HistoryListItem
                      key={verification?.id}
                      verification={verification}
                      onDelete={handleDeleteItem}
                      onShare={handleShareItem}
                      onReVerify={handleReVerify}
                      isSelected={selectedItems?.has(verification?.id)}
                      onSelect={handleSelectItem}
                      showCheckbox={selectedItems?.size > 0 || filteredVerifications?.length > 1}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredVerifications?.length > 0 && filteredVerifications?.length >= 10 && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    iconName="ChevronDown"
                    iconPosition="right"
                  >
                    Load More Results
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Reporting Modal */}
      <EmergencyReportingModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSubmit={handleEmergencyReport}
      />
    </div>
  );
};

export default VerificationHistory;
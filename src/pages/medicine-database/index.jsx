import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Database, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import Header from '../../components/ui/Header';
import AdvancedSearch from '../../components/ui/AdvancedSearch';
import MedicineCard from '../../components/ui/MedicineCard';
import { medicineDatabase, searchMedicine, getExpiringMedicines } from '../../data/medicineDatabase';
import { useToast } from '../../components/ui/Toast';

const MedicineDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { addToast } = useToast();

  const categories = [...new Set(medicineDatabase.map(med => med.category))];
  const expiringMedicines = getExpiringMedicines();

  const filteredMedicines = useMemo(() => {
    let medicines = searchMedicine(filters.query || searchQuery);
    
    if (filters.category) {
      medicines = medicines.filter(med => med.category === filters.category);
    }
    
    if (filters.dateRange?.from) {
      medicines = medicines.filter(med => 
        new Date(med.expiryDate) >= new Date(filters.dateRange.from)
      );
    }
    
    if (filters.dateRange?.to) {
      medicines = medicines.filter(med => 
        new Date(med.expiryDate) <= new Date(filters.dateRange.to)
      );
    }
    
    // Sort medicines
    medicines.sort((a, b) => {
      const aValue = a[filters.sortBy || 'name'];
      const bValue = b[filters.sortBy || 'name'];
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      
      return (aValue - bValue) * order;
    });
    
    return medicines;
  }, [searchQuery, filters]);

  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    addToast(`Selected ${medicine.name}`, 'success');
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const stats = {
    total: medicineDatabase.length,
    categories: categories.length,
    expiring: expiringMedicines.length,
    filtered: filteredMedicines.length
  };

  return (
    <>
      <Helmet>
        <title>Medicine Database | MediVerify</title>
        <meta name="description" content="Comprehensive medicine database with detailed information and search capabilities" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Medicine Database" />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
            >
              <div className="flex items-center">
                <Database className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Medicines</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
            >
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.categories}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.expiring}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
            >
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtered Results</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.filtered}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
            <AdvancedSearch
              onSearch={setSearchQuery}
              onFilter={setFilters}
              categories={categories}
              placeholder="Search medicines by name, generic name, category..."
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MedicineCard
                  medicine={medicine}
                  onSelect={handleMedicineSelect}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No medicines found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default MedicineDatabase;

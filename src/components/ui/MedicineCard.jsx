import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Shield,
  Clock
} from 'lucide-react';
import Button from './Button';

const MedicineCard = ({ medicine, onSelect, onViewDetails, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isExpiring = () => {
    const expiryDate = new Date(medicine.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Analgesic/Antipyretic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'NSAID': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Antibiotic': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Antidiabetic': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'NSAID/Antiplatelet': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <motion.div
      layout
      className={`card-interactive h-full bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 overflow-hidden ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-1">
              {medicine.name}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              {medicine.genericName} • <span className="font-semibold">{medicine.dosage}</span>
            </p>
          </div>
          {isExpiring() && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold whitespace-nowrap ml-3">
              <AlertTriangle className="w-4 h-4" />
              <span>Expiring Soon</span>
            </div>
          )}
        </div>

        {/* Category and Form */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(medicine.category)}`}>
            {medicine.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-slate-400 px-3 py-1.5 bg-muted dark:bg-slate-800 rounded-full font-medium">
            <Package className="w-4 h-4" />
            {medicine.form}
          </span>
        </div>

        {/* Basic Info */}
        <div className="space-y-3 text-sm border-t border-border dark:border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground dark:text-slate-400 font-medium">Manufacturer</span>
            <span className="font-semibold text-foreground dark:text-white">{medicine.manufacturer}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" />
              Expiry Date
            </span>
            <span className={`font-semibold ${
              isExpiring() 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-success dark:text-emerald-400'
            }`}>
              {new Date(medicine.expiryDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t dark:border-gray-700 space-y-3"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Description
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{medicine.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Dosage Instructions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{medicine.dosageInstructions}</p>
            </div>

            {medicine.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Important Warnings
                </h4>
                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                  {medicine.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Less Info
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                More Info
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(medicine)}
              >
                View Details
              </Button>
            )}
            {onSelect && (
              <Button
                size="sm"
                onClick={() => onSelect(medicine)}
              >
                Select
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;

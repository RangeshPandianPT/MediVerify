import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ 
  selectedCount = 0, 
  totalCount = 0,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkExport,
  onBulkShare,
  isVisible = false 
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartialSelected = selectedCount > 0 && selectedCount < totalCount;

  if (!isVisible && selectedCount === 0) return null;

  return (
    <div className={`
      bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4
      transition-all duration-300 ${selectedCount > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isPartialSelected;
                }}
                onChange={isAllSelected ? onDeselectAll : onSelectAll}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedCount === totalCount ? 'All' : selectedCount} of {totalCount} selected
            </span>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Info" size={12} />
              <span>Bulk actions available</span>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkExport}
            disabled={selectedCount === 0}
            iconName="Download"
            iconPosition="left"
            className="text-xs"
          >
            Export ({selectedCount})
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkShare}
            disabled={selectedCount === 0}
            iconName="Share2"
            iconPosition="left"
            className="text-xs"
          >
            Share
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkDelete}
            disabled={selectedCount === 0}
            iconName="Trash2"
            iconPosition="left"
            className="text-xs text-error hover:text-error hover:bg-error/10"
          >
            Delete ({selectedCount})
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>

      {/* Quick Export Options */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Quick export:</span>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkExport('pdf')}
            iconName="FileText"
            iconPosition="left"
            className="text-xs"
          >
            PDF Report
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkExport('csv')}
            iconName="Table"
            iconPosition="left"
            className="text-xs"
          >
            CSV Data
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkExport('json')}
            iconName="Code"
            iconPosition="left"
            className="text-xs"
          >
            JSON
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;
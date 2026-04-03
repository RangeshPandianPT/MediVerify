import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { searchMedicine } from '../../../data/medicineDatabase';

const MedicineReferenceLookup = ({ onSelect, selectedMedicine = null, className = '' }) => {
  const [query, setQuery] = useState(selectedMedicine?.name || '');

  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return searchMedicine(query).slice(0, 5);
  }, [query]);

  const handleSelect = (medicine) => {
    setQuery(medicine?.name || '');
    onSelect?.(medicine);
  };

  const handleClear = () => {
    setQuery('');
    onSelect?.(null);
  };

  return (
    <div className={`rounded-xl border border-border bg-card p-4 shadow-subtle ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Search" size={16} color="var(--color-primary)" />
            <h3 className="font-semibold text-foreground">Medicine reference lookup</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Search medicine names, manufacturers, or categories to autofill reference details before verification.
          </p>
        </div>

        {selectedMedicine && (
          <Button variant="ghost" size="sm" onClick={handleClear} iconName="X" iconPosition="left">
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search medicine, manufacturer, or category"
          description="Autocomplete suggestions update as you type."
        />

        {suggestions.length > 0 && (
          <div className="max-h-64 overflow-auto rounded-lg border border-border/70 bg-background">
            {suggestions.map((medicine) => (
              <button
                key={medicine.id}
                type="button"
                onClick={() => handleSelect(medicine)}
                className="w-full text-left px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{medicine.name} {medicine.dosage}</p>
                    <p className="text-sm text-muted-foreground">{medicine.manufacturer} • {medicine.category}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{medicine.form}</div>
                    <div className="font-mono mt-1">Batch {medicine.batchNumber}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!selectedMedicine && query.trim().length >= 2 && suggestions.length === 0 && (
          <p className="text-sm text-muted-foreground">No matching medicine found. Try a manufacturer or category name.</p>
        )}

        {selectedMedicine && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected medicine</p>
              <p className="font-semibold text-foreground">{selectedMedicine?.name} {selectedMedicine?.dosage}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Manufacturer</p>
              <p className="font-medium text-foreground">{selectedMedicine?.manufacturer}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Batch reference</p>
              <p className="font-mono font-medium text-foreground">{selectedMedicine?.batchNumber}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineReferenceLookup;
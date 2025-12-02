// Enhanced localStorage utilities with error handling
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Medicine verification history management
export const verificationStorage = {
  getHistory: () => {
    return storage.get('verificationHistory') || [];
  },

  addVerification: (verification) => {
    const history = verificationStorage.getHistory();
    const newVerification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...verification
    };
    history.unshift(newVerification);
    
    // Keep only last 100 verifications
    if (history.length > 100) {
      history.splice(100);
    }
    
    return storage.set('verificationHistory', history);
  },

  removeVerification: (id) => {
    const history = verificationStorage.getHistory();
    const filtered = history.filter(item => item.id !== id);
    return storage.set('verificationHistory', filtered);
  },

  clearHistory: () => {
    return storage.remove('verificationHistory');
  }
};

// User preferences
export const userPreferences = {
  get: () => {
    return storage.get('userPreferences') || {
      notifications: true,
      autoSave: true,
      language: 'en',
      theme: 'light'
    };
  },

  update: (preferences) => {
    const current = userPreferences.get();
    return storage.set('userPreferences', { ...current, ...preferences });
  }
};

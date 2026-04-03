import { useEffect } from 'react';
import { useToast } from './Toast';
import { buildOfflineQueueSummary, syncOfflineVerificationQueue } from '../../utils/verificationSync';

const OfflineVerificationSync = () => {
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const syncQueue = async () => {
      const summaryBefore = buildOfflineQueueSummary();
      if (summaryBefore.total === 0) {
        return;
      }

      try {
        const result = await syncOfflineVerificationQueue();

        if (!isMounted) {
          return;
        }

        if (result.synced > 0) {
          addToast(`Synced ${result.synced} queued verification${result.synced === 1 ? '' : 's'}.`, 'success');
        }
      } catch (error) {
        console.warn('Offline queue sync failed:', error);
      }
    };

    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener('online', handleOnline);

    if (navigator.onLine) {
      syncQueue();
    }

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
    };
  }, [addToast]);

  return null;
};

export default OfflineVerificationSync;
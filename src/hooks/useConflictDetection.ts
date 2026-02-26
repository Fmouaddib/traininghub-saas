import { useMutation } from '@tanstack/react-query';
import { ConflictDetector, type ConflictInfo } from '../lib/services/conflict-detector';

export const useConflictDetection = () => {
  return useMutation({
    mutationFn: (params: {
      startTime: string;
      endTime: string;
      roomId?: string;
      trainerId?: string;
      excludeSessionId?: string;
    }): Promise<ConflictInfo[]> => ConflictDetector.detectConflicts(params),
  });
};

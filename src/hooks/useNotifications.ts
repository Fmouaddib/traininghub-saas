import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '../lib/services/notifications';

const NOTIF_KEYS = {
  list: ['notifications'] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIF_KEYS.list,
    queryFn: () => NotificationsService.getNotifications(),
    staleTime: 60 * 1000, // 60s
    refetchInterval: 60 * 1000, // Poll every 60s
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIF_KEYS.unreadCount,
    queryFn: () => NotificationsService.getUnreadCount(),
    staleTime: 30 * 1000, // 30s
    refetchInterval: 30 * 1000, // Poll every 30s
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.unreadCount });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.unreadCount });
    },
  });
};

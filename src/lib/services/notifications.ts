import { supabase } from '../supabase';

export interface AppNotification {
  id: string;
  user_id: string;
  center_id?: string;
  type: 'info' | 'session' | 'alert' | 'system';
  title: string;
  body?: string;
  link?: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export class NotificationsService {
  static async getNotifications(limit = 20): Promise<AppNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as AppNotification[];
    } catch {
      console.log('🔔 Mode simulation - Notifications simulees');
      return NotificationsService.getMockNotifications();
    }
  }

  static async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch {
      return NotificationsService.getMockNotifications().filter(n => !n.is_read).length;
    }
  }

  static async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    } catch {
      console.log('🔔 Mode simulation - Notification marquee comme lue:', id);
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      if (error) throw error;
    } catch {
      console.log('🔔 Mode simulation - Toutes les notifications marquees comme lues');
    }
  }

  private static getMockNotifications(): AppNotification[] {
    const now = Date.now();
    return [
      {
        id: 'n1', user_id: 'demo', type: 'session', title: 'Nouvelle session creee',
        body: 'La session "React Avance - Groupe A" a ete planifiee pour demain.', link: '/sessions',
        is_read: false, created_at: new Date(now - 300000).toISOString(),
      },
      {
        id: 'n2', user_id: 'demo', type: 'alert', title: 'Conflit de salle detecte',
        body: 'La salle "A102" est reservee pour 2 sessions le 15/03 de 14h a 16h.', link: '/sessions',
        is_read: false, created_at: new Date(now - 3600000).toISOString(),
      },
      {
        id: 'n3', user_id: 'demo', type: 'info', title: 'Bienvenue sur AntiPlanning',
        body: 'Decouvrez toutes les fonctionnalites de votre espace de gestion.',
        is_read: true, created_at: new Date(now - 86400000).toISOString(),
      },
      {
        id: 'n4', user_id: 'demo', type: 'system', title: 'Mise a jour disponible',
        body: 'La version 2.1 est disponible avec de nouvelles fonctionnalites.',
        is_read: true, created_at: new Date(now - 172800000).toISOString(),
      },
    ];
  }
}

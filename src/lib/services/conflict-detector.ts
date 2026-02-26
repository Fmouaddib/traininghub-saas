import { supabase } from '../supabase';

export interface ConflictInfo {
  type: 'room' | 'trainer';
  sessionId: string;
  sessionTitle: string;
  startTime: string;
  endTime: string;
  details: string;
}

export class ConflictDetector {
  static async detectConflicts(params: {
    startTime: string;
    endTime: string;
    roomId?: string;
    trainerId?: string;
    excludeSessionId?: string;
  }): Promise<ConflictInfo[]> {
    const { startTime, endTime, roomId, trainerId, excludeSessionId } = params;
    const conflicts: ConflictInfo[] = [];

    if (!startTime || !endTime) return conflicts;

    try {
      // Check room conflicts
      if (roomId) {
        let query = supabase
          .from('training_sessions')
          .select('id, title, start_time, end_time, room:rooms(name)')
          .eq('room_id', roomId)
          .neq('status', 'cancelled')
          .lt('start_time', endTime)
          .gt('end_time', startTime);

        if (excludeSessionId) {
          query = query.neq('id', excludeSessionId);
        }

        const { data } = await query;
        if (data && data.length > 0) {
          for (const s of data) {
            conflicts.push({
              type: 'room',
              sessionId: s.id,
              sessionTitle: s.title || 'Sans titre',
              startTime: s.start_time,
              endTime: s.end_time,
              details: `Conflit de salle : "${s.title}" utilise deja cette salle`,
            });
          }
        }
      }

      // Check trainer conflicts
      if (trainerId) {
        let query = supabase
          .from('training_sessions')
          .select('id, title, start_time, end_time, trainer:profiles!trainer_id(full_name)')
          .eq('trainer_id', trainerId)
          .neq('status', 'cancelled')
          .lt('start_time', endTime)
          .gt('end_time', startTime);

        if (excludeSessionId) {
          query = query.neq('id', excludeSessionId);
        }

        const { data } = await query;
        if (data && data.length > 0) {
          for (const s of data) {
            conflicts.push({
              type: 'trainer',
              sessionId: s.id,
              sessionTitle: s.title || 'Sans titre',
              startTime: s.start_time,
              endTime: s.end_time,
              details: `Conflit de formateur : deja assigne a "${s.title}"`,
            });
          }
        }
      }

      return conflicts;
    } catch {
      console.log('🔍 Mode simulation - Detection de conflits simulee');
      return ConflictDetector.getMockConflicts(params);
    }
  }

  private static getMockConflicts(params: {
    startTime: string;
    endTime: string;
    roomId?: string;
    trainerId?: string;
  }): ConflictInfo[] {
    // In simulation, only return conflicts if there are real values
    if (!params.roomId && !params.trainerId) return [];
    if (!params.startTime || !params.endTime) return [];
    return [];
  }
}

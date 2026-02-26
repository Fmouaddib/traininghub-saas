import type { SessionFilters } from '../../lib/types';

interface CalendarFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  trainers: { id: string; full_name: string }[];
  rooms: { id: string; name: string }[];
  programs: { id: string; title?: string; name?: string }[];
}

export const CalendarFilters = ({
  filters, onFiltersChange, trainers, rooms, programs,
}: CalendarFiltersProps) => {
  const update = (key: keyof SessionFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-gray-300)',
    fontSize: '0.8rem', background: 'white', cursor: 'pointer', minWidth: '120px',
  };

  return (
    <div className="calendar-filters">
      <select
        style={selectStyle}
        value={filters.trainerId || ''}
        onChange={(e) => update('trainerId', e.target.value)}
      >
        <option value="">Tous les formateurs</option>
        {trainers.map(t => (
          <option key={t.id} value={t.id}>{t.full_name}</option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={filters.roomId || ''}
        onChange={(e) => update('roomId', e.target.value)}
      >
        <option value="">Toutes les salles</option>
        {rooms.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={filters.programId || ''}
        onChange={(e) => update('programId', e.target.value)}
      >
        <option value="">Tous les programmes</option>
        {programs.map(p => (
          <option key={p.id} value={p.id}>{p.title || p.name}</option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={filters.sessionType || ''}
        onChange={(e) => update('sessionType', e.target.value)}
      >
        <option value="">Tous les types</option>
        <option value="in_person">Presentiel</option>
        <option value="online">En ligne</option>
        <option value="hybrid">Hybride</option>
      </select>

      <select
        style={selectStyle}
        value={filters.status || ''}
        onChange={(e) => update('status', e.target.value)}
      >
        <option value="">Tous les statuts</option>
        <option value="scheduled">Planifiee</option>
        <option value="in_progress">En cours</option>
        <option value="completed">Terminee</option>
        <option value="cancelled">Annulee</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={() => onFiltersChange({})}
          style={{
            padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-gray-300)',
            fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Effacer
        </button>
      )}
    </div>
  );
};

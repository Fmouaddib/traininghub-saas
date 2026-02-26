import React, { useState, useMemo, useCallback } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, X, Clock, Users, Monitor, Building2 } from 'lucide-react';
import { useSessions, useRoomsRef, useTrainers, usePrograms } from '../../hooks/useSessions';
import { CalendarFilters } from './CalendarFilters';
import type { TrainingSession, SessionFilters } from '../../lib/types';

interface CalendarViewProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  fullPage?: boolean;
}

type ViewMode = 'month' | 'week' | 'day';
type ColorMode = 'type' | 'status' | 'program';

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function toLocalDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  in_person: { bg: '#002F5D', text: '#ffffff', label: 'Présentiel' },
  online: { bg: '#001B39', text: '#ffffff', label: 'En ligne' },
  hybrid: { bg: '#FBA625', text: '#001B39', label: 'Hybride' },
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: '#3b82f6', text: '#ffffff', label: 'Planifiée' },
  in_progress: { bg: '#f59e0b', text: '#001B39', label: 'En cours' },
  completed: { bg: '#22c55e', text: '#ffffff', label: 'Terminée' },
  cancelled: { bg: '#ef4444', text: '#ffffff', label: 'Annulée' },
};

const programColors = [
  { bg: '#6366f1', text: '#ffffff' },
  { bg: '#ec4899', text: '#ffffff' },
  { bg: '#14b8a6', text: '#ffffff' },
  { bg: '#f97316', text: '#ffffff' },
  { bg: '#8b5cf6', text: '#ffffff' },
  { bg: '#06b6d4', text: '#ffffff' },
  { bg: '#84cc16', text: '#001B39' },
  { bg: '#e11d48', text: '#ffffff' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Planifiée', color: '#3b82f6' },
  in_progress: { label: 'En cours', color: '#f59e0b' },
  completed: { label: 'Terminée', color: '#22c55e' },
  cancelled: { label: 'Annulée', color: '#ef4444' },
};

const defaultColor = { bg: '#9ca3af', text: '#ffffff', label: 'Autre' };

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);

export const CalendarView: React.FC<CalendarViewProps> = ({ onDateClick, onEventClick, fullPage = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [colorMode, setColorMode] = useState<ColorMode>('type');
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [filters, setFilters] = useState<SessionFilters>({});
  const { data: sessions = [], isLoading, error } = useSessions(filters);
  const { data: trainersData = [] } = useTrainers();
  const { data: roomsData = [] } = useRoomsRef();
  const { data: programsData = [] } = usePrograms();

  // Build program color map
  const programColorMap = useMemo(() => {
    const map: Record<string, { bg: string; text: string }> = {};
    const uniquePrograms = [...new Set(sessions.map(s => s.program_id).filter(Boolean))];
    uniquePrograms.forEach((pid, i) => {
      if (pid) map[pid] = programColors[i % programColors.length];
    });
    return map;
  }, [sessions]);

  const getSessionColor = useCallback((session: TrainingSession) => {
    switch (colorMode) {
      case 'status':
        return statusColors[session.status] || defaultColor;
      case 'program':
        if (session.program_id && programColorMap[session.program_id]) {
          const c = programColorMap[session.program_id];
          return { ...c, label: session.program?.title || 'Programme' };
        }
        return defaultColor;
      default:
        return typeColors[session.session_type] || defaultColor;
    }
  }, [colorMode, programColorMap]);

  // ---- Month view grid ----
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
    }
    return days;
  }, [currentDate]);

  // ---- Week view days ----
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  // ---- Sessions by date map ----
  const sessionsByDate = useMemo(() => {
    const map: Record<string, TrainingSession[]> = {};
    for (const s of sessions) {
      if (!s.start_time) continue;
      const key = toLocalDateKey(new Date(s.start_time));
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    return map;
  }, [sessions]);

  const monthSessionCount = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return sessions.filter(s => {
      if (!s.start_time) return false;
      const d = new Date(s.start_time);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [sessions, currentDate]);

  const todayKey = toLocalDateKey(new Date());

  const prevPeriod = useCallback(() => {
    setCurrentDate(d => {
      if (viewMode === 'day') return addDays(d, -1);
      if (viewMode === 'week') return addDays(d, -7);
      return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    });
  }, [viewMode]);

  const nextPeriod = useCallback(() => {
    setCurrentDate(d => {
      if (viewMode === 'day') return addDays(d, 1);
      if (viewMode === 'week') return addDays(d, 7);
      return new Date(d.getFullYear(), d.getMonth() + 1, 1);
    });
  }, [viewMode]);

  const goToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleEventClick = useCallback((session: TrainingSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(session);
    onEventClick?.(session.id);
  }, [onEventClick]);

  const closeModal = useCallback(() => {
    setSelectedSession(null);
  }, []);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="calendar-container" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div className="animate-spin" style={{
            width: 20, height: 20, borderRadius: '50%',
            border: '2px solid #e5e5e5', borderTopColor: '#002F5D',
          }} />
          <span style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>Chargement du calendrier...</span>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <div className="calendar-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <Calendar style={{ width: 32, height: 32, color: '#d4d4d4', margin: '0 auto 0.5rem' }} />
        <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>Impossible de charger le calendrier.</p>
      </div>
    );
  }

  // ---- Header title ----
  const headerTitle = viewMode === 'day'
    ? format(currentDate, "EEEE d MMMM yyyy", { locale: fr })
    : viewMode === 'week'
      ? `${format(weekDays[0], 'd', { locale: fr })} - ${format(weekDays[6], 'd MMMM yyyy', { locale: fr })}`
      : format(currentDate, 'MMMM yyyy', { locale: fr });

  // ---- Day view sessions ----
  const dayKey = toLocalDateKey(currentDate);
  const daySessions = sessionsByDate[dayKey] || [];

  // ---- Color mode legend ----
  const renderLegend = () => {
    if (colorMode === 'type') {
      return Object.entries(typeColors).map(([key, val]) => (
        <span key={key} className="calendar-legend-item">
          <span className="calendar-legend-dot" style={{ background: val.bg }} />
          {val.label}
        </span>
      ));
    }
    if (colorMode === 'status') {
      return Object.entries(statusColors).map(([key, val]) => (
        <span key={key} className="calendar-legend-item">
          <span className="calendar-legend-dot" style={{ background: val.bg }} />
          {val.label}
        </span>
      ));
    }
    return null;
  };

  return (
    <>
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="calendar-title" style={{ textTransform: 'capitalize' }}>
              {headerTitle}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <button onClick={prevPeriod} className="calendar-nav-btn" aria-label="Précédent">
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={goToday} className="calendar-today-btn">
                Aujourd'hui
              </button>
              <button onClick={nextPeriod} className="calendar-nav-btn" aria-label="Suivant">
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
            {/* View toggle */}
            {fullPage && (
              <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
                {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    className={`calendar-view-btn ${viewMode === mode ? 'active' : ''}`}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
                  </button>
                ))}
              </div>
            )}
            {/* Color mode selector */}
            {fullPage && (
              <select
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value as ColorMode)}
                style={{
                  padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-gray-300)',
                  fontSize: '0.75rem', marginLeft: '8px', cursor: 'pointer', background: 'white',
                }}
              >
                <option value="type">Couleur: Type</option>
                <option value="status">Couleur: Statut</option>
                <option value="program">Couleur: Programme</option>
              </select>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="calendar-legend">
              {renderLegend()}
              <span style={{ color: '#e5e5e5' }}>|</span>
              <span style={{ fontWeight: 600, color: '#737373' }}>
                {monthSessionCount} session{monthSessionCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        {fullPage && (
          <div style={{ padding: '0 0.75rem' }}>
            <CalendarFilters
              filters={filters}
              onFiltersChange={setFilters}
              trainers={trainersData as { id: string; full_name: string }[]}
              rooms={roomsData as { id: string; name: string }[]}
              programs={programsData as { id: string; title?: string; name?: string }[]}
            />
          </div>
        )}

        {/* Calendar Grid */}
        <div style={{ padding: '0.75rem' }}>
          {viewMode === 'month' ? (
            <>
              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 4 }}>
                {DAYS_FR.map((day) => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1,
                background: '#f0f0f0', borderRadius: 12, overflow: 'hidden',
              }}>
                {calendarGrid.map(({ date, isCurrentMonth }, index) => {
                  const key = toLocalDateKey(date);
                  const cellSessions = sessionsByDate[key] || [];
                  const isToday = key === todayKey;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (fullPage) {
                          setCurrentDate(date);
                          setViewMode('day');
                        }
                        onDateClick?.(date);
                      }}
                      className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    >
                      <div className={`calendar-day-number ${isToday ? 'today' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cellSessions.slice(0, 3).map((session) => {
                          const color = getSessionColor(session);
                          const startTime = session.start_time ? formatTime(session.start_time) : '';
                          const title = session.title || 'Sans titre';
                          return (
                            <div
                              key={session.id}
                              onClick={(e) => handleEventClick(session, e)}
                              className="calendar-event-pill"
                              style={{ backgroundColor: color.bg, color: color.text }}
                              title={`${startTime} - ${title}`}
                            >
                              <span style={{ fontWeight: 600, flexShrink: 0 }}>{startTime}</span>{' '}{title}
                            </div>
                          );
                        })}
                        {cellSessions.length > 3 && (
                          <div style={{ fontSize: 10, color: '#a3a3a3', paddingLeft: 4 }}>
                            +{cellSessions.length - 3} autre{cellSessions.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : viewMode === 'day' ? (
            /* ---- Day View ---- */
            <div>
              <div style={{ maxHeight: fullPage ? 'calc(100vh - 350px)' : 500, overflowY: 'auto' }}>
                <div className="calendar-week-grid" style={{ gridTemplateColumns: '60px 1fr' }}>
                  {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                      <div className="calendar-week-time">
                        {String(hour).padStart(2, '0')}:00
                      </div>
                      <div
                        className="calendar-week-cell"
                        onClick={() => onDateClick?.(currentDate)}
                      >
                        {daySessions.filter(s => {
                          if (!s.start_time) return false;
                          return new Date(s.start_time).getHours() === hour;
                        }).map(session => {
                          const color = getSessionColor(session);
                          const startH = new Date(session.start_time).getHours();
                          const startM = new Date(session.start_time).getMinutes();
                          const endH = session.end_time ? new Date(session.end_time).getHours() : startH + 1;
                          const endM = session.end_time ? new Date(session.end_time).getMinutes() : 0;
                          const durationMinutes = (endH - startH) * 60 + (endM - startM);
                          const heightPx = Math.max(20, (durationMinutes / 60) * 48);
                          const topPx = (startM / 60) * 48;
                          return (
                            <div
                              key={session.id}
                              className="calendar-week-event"
                              style={{
                                top: topPx, height: heightPx,
                                backgroundColor: color.bg, color: color.text,
                                left: '4px', right: '4px',
                              }}
                              onClick={(e) => handleEventClick(session, e)}
                              title={`${formatTime(session.start_time)} - ${session.title || 'Sans titre'}`}
                            >
                              <strong>{formatTime(session.start_time)}</strong> {session.title || 'Sans titre'}
                              {session.room && <span style={{ opacity: 0.8, marginLeft: '8px' }}>({session.room.name})</span>}
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ---- Week View ---- */
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 0, borderBottom: '1px solid #e5e5e5' }}>
                <div />
                {weekDays.map((day, i) => {
                  const isToday = toLocalDateKey(day) === todayKey;
                  return (
                    <div key={i} style={{
                      textAlign: 'center', padding: '0.5rem 0',
                      borderLeft: '1px solid #f0f0f0', cursor: 'pointer',
                    }}
                    onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                    >
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase' }}>
                        {DAYS_FR[i]}
                      </div>
                      <div style={{
                        fontSize: '1.125rem', fontWeight: isToday ? 700 : 500,
                        color: isToday ? '#002F5D' : '#525252',
                        width: 32, height: 32, borderRadius: '50%', margin: '2px auto',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...(isToday ? { background: 'linear-gradient(135deg, #002F5D, #001B39)', color: '#fff' } : {}),
                      }}>
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ maxHeight: fullPage ? 'calc(100vh - 300px)' : 500, overflowY: 'auto' }}>
                <div className="calendar-week-grid">
                  {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                      <div className="calendar-week-time">
                        {String(hour).padStart(2, '0')}:00
                      </div>
                      {weekDays.map((day, dayIdx) => {
                        const wDayKey = toLocalDateKey(day);
                        const wDaySessions = (sessionsByDate[wDayKey] || []).filter(s => {
                          if (!s.start_time) return false;
                          return new Date(s.start_time).getHours() === hour;
                        });
                        return (
                          <div
                            key={dayIdx}
                            className="calendar-week-cell"
                            onClick={() => onDateClick?.(day)}
                          >
                            {wDaySessions.map(session => {
                              const color = getSessionColor(session);
                              const startH = new Date(session.start_time).getHours();
                              const startM = new Date(session.start_time).getMinutes();
                              const endH = session.end_time ? new Date(session.end_time).getHours() : startH + 1;
                              const endM = session.end_time ? new Date(session.end_time).getMinutes() : 0;
                              const durationMinutes = (endH - startH) * 60 + (endM - startM);
                              const heightPx = Math.max(20, (durationMinutes / 60) * 48);
                              const topPx = (startM / 60) * 48;
                              return (
                                <div
                                  key={session.id}
                                  className="calendar-week-event"
                                  style={{
                                    top: topPx, height: heightPx,
                                    backgroundColor: color.bg, color: color.text,
                                  }}
                                  onClick={(e) => handleEventClick(session, e)}
                                  title={`${formatTime(session.start_time)} - ${session.title || 'Sans titre'}`}
                                >
                                  {formatTime(session.start_time)} {session.title || 'Sans titre'}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedSession && (
        <div className="calendar-modal-overlay" onClick={closeModal}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: (typeColors[selectedSession.session_type] || defaultColor).bg,
                }} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {selectedSession.title || 'Sans titre'}
                </h4>
              </div>
              <button className="calendar-modal-close" onClick={closeModal}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div className="calendar-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Type & Status */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600,
                    background: (typeColors[selectedSession.session_type] || defaultColor).bg,
                    color: (typeColors[selectedSession.session_type] || defaultColor).text,
                  }}>
                    {selectedSession.session_type === 'in_person' && <Building2 style={{ width: 10, height: 10, marginRight: 3, verticalAlign: 'middle' }} />}
                    {selectedSession.session_type === 'online' && <Monitor style={{ width: 10, height: 10, marginRight: 3, verticalAlign: 'middle' }} />}
                    {(typeColors[selectedSession.session_type] || defaultColor).label}
                  </span>
                  {statusLabels[selectedSession.status] && (
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600,
                      background: `${statusLabels[selectedSession.status].color}15`,
                      color: statusLabels[selectedSession.status].color,
                    }}>
                      {statusLabels[selectedSession.status].label}
                    </span>
                  )}
                </div>

                {/* Date & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#525252' }}>
                  <Clock style={{ width: 14, height: 14, color: '#a3a3a3' }} />
                  <span>
                    {selectedSession.start_time && format(new Date(selectedSession.start_time), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    {selectedSession.end_time && ` - ${formatTime(selectedSession.end_time)}`}
                  </span>
                </div>

                {/* Participants */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#525252' }}>
                  <Users style={{ width: 14, height: 14, color: '#a3a3a3' }} />
                  <span>{selectedSession.current_participants} / {selectedSession.max_participants} participants</span>
                </div>

                {/* Zoom link */}
                {selectedSession.zoom_meeting_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#525252' }}>
                    <Monitor style={{ width: 14, height: 14, color: '#a3a3a3' }} />
                    <a
                      href={selectedSession.zoom_meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#002F5D', textDecoration: 'underline' }}
                    >
                      Rejoindre le meeting Zoom
                    </a>
                  </div>
                )}

                {/* Description */}
                {selectedSession.description && (
                  <div style={{ fontSize: '0.8125rem', color: '#737373', lineHeight: 1.5, borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                    {selectedSession.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

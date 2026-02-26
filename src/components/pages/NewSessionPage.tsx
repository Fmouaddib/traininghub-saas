import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCreateSession, useRoomsRef, useTrainers, usePrograms, useSubjectsRef } from '../../hooks/useSessions';
import { useClassesForSubject, useClassStudents } from '../../hooks/useClasses';
import { useConflictDetection } from '../../hooks/useConflictDetection';
import { ParticipantsService } from '../../lib/services/participants';
import type { CreateSessionData } from '../../lib/types';
import type { ConflictInfo } from '../../lib/services/conflict-detector';

interface NewSessionPageProps {
  onBack: () => void;
}

export const NewSessionPage: React.FC<NewSessionPageProps> = ({ onBack }) => {
  const { data: rooms = [] } = useRoomsRef();
  const { data: trainers = [] } = useTrainers();
  const { data: programs = [] } = usePrograms();
  const { data: subjects = [] } = useSubjectsRef();
  const createMutation = useCreateSession();
  const conflictDetection = useConflictDetection();

  const [formData, setFormData] = useState<CreateSessionData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    session_type: 'in_person',
    max_participants: 20,
    trainer_id: '',
    room_id: '',
    program_id: '',
    subject_id: '',
    class_id: '',
  });

  const [autoEnroll, setAutoEnroll] = useState(false);
  const { data: classesForSubject = [] } = useClassesForSubject(formData.subject_id || '');
  const { data: classStudents = [] } = useClassStudents(formData.class_id || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);

  // Check conflicts when relevant fields change
  useEffect(() => {
    if (formData.start_time && formData.end_time && (formData.room_id || formData.trainer_id)) {
      const timer = setTimeout(() => {
        conflictDetection.mutate({
          startTime: formData.start_time,
          endTime: formData.end_time,
          roomId: formData.room_id || undefined,
          trainerId: formData.trainer_id || undefined,
        }, {
          onSuccess: (data) => setConflicts(data),
        });
      }, 500); // Debounce 500ms
      return () => clearTimeout(timer);
    } else {
      setConflicts([]);
    }
  }, [formData.start_time, formData.end_time, formData.room_id, formData.trainer_id]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Le titre est requis';
    if (!formData.start_time) errs.start_time = 'La date de début est requise';
    if (!formData.end_time) errs.end_time = 'La date de fin est requise';
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      errs.end_time = 'La date de fin doit être après la date de début';
    }
    if (formData.max_participants < 1) errs.max_participants = 'Minimum 1 participant';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const session = await createMutation.mutateAsync(formData);
    // Auto-enroll class students
    if (autoEnroll && formData.class_id && classStudents.length > 0 && session?.id) {
      for (const s of classStudents) {
        try {
          await ParticipantsService.addParticipant({
            session_id: session.id,
            participant_name: s.full_name,
            participant_email: s.email,
          });
        } catch { /* ignore duplicates */ }
      }
    }
    onBack();
  };

  const fieldClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-neutral-200'
    }`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux sessions
        </button>
        <h1 className="text-2xl font-bold text-neutral-900">Créer une nouvelle session</h1>
        <p className="text-neutral-600 mt-1">Planifiez une nouvelle session de formation</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Titre de la session *</label>
          <input
            type="text"
            className={fieldClass('title')}
            placeholder="ex: Formation React avancé"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent"
            placeholder="Décrivez le contenu de la session..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date et heure de début *</label>
            <input
              type="datetime-local"
              className={fieldClass('start_time')}
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
            {errors.start_time && <p className="text-sm text-red-600 mt-1">{errors.start_time}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date et heure de fin *</label>
            <input
              type="datetime-local"
              className={fieldClass('end_time')}
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
            {errors.end_time && <p className="text-sm text-red-600 mt-1">{errors.end_time}</p>}
          </div>
        </div>

        {/* Type + Max participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type de session</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D]"
              value={formData.session_type}
              onChange={(e) => setFormData({ ...formData, session_type: e.target.value as CreateSessionData['session_type'] })}
            >
              <option value="in_person">Présentiel</option>
              <option value="online">En ligne</option>
              <option value="hybrid">Hybride</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre max de participants</label>
            <input
              type="number"
              min={1}
              className={fieldClass('max_participants')}
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 1 })}
            />
            {errors.max_participants && <p className="text-sm text-red-600 mt-1">{errors.max_participants}</p>}
          </div>
        </div>

        {/* Salle */}
        {rooms.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Salle</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D]"
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
            >
              <option value="">-- Aucune salle --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (capacité: {room.capacity})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Formateur */}
        {trainers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Formateur</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent"
              value={formData.trainer_id}
              onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
            >
              <option value="">-- Aucun formateur --</option>
              {trainers.map((t: { id: string; full_name: string }) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Conflict Warnings */}
        {conflicts.length > 0 && (
          <div style={{
            padding: '12px 16px', background: '#fef3c7', border: '1px solid #f59e0b',
            borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span> {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''} detecte{conflicts.length > 1 ? 's' : ''}
            </div>
            {conflicts.map((c, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: '#78350f', paddingLeft: '22px' }}>
                {c.type === 'room' ? '🏢' : '👤'} {c.details}
                <span style={{ color: '#92400e', fontSize: '0.8rem', marginLeft: '8px' }}>
                  ({new Date(c.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Matiere */}
        {subjects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Matiere</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent"
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value, class_id: '' })}
            >
              <option value="">-- Aucune matiere --</option>
              {subjects.map((s: { id: string; name: string; code?: string }) => (
                <option key={s.id} value={s.id}>{s.name}{s.code ? ` (${s.code})` : ''}</option>
              ))}
            </select>
          </div>
        )}

        {/* Classe (conditioned on subject) */}
        {formData.subject_id && classesForSubject.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Classe</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent"
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            >
              <option value="">-- Aucune classe --</option>
              {classesForSubject.map((c) => (
                <option key={c.id} value={c.id}>{c.name}{c.diploma ? ` - ${c.diploma.title}` : ''} ({c.student_count || 0} etudiants)</option>
              ))}
            </select>
          </div>
        )}

        {/* Auto-enrollment */}
        {formData.class_id && classStudents.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="auto-enroll"
              checked={autoEnroll}
              onChange={(e) => setAutoEnroll(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300"
            />
            <label htmlFor="auto-enroll" className="text-sm text-blue-800">
              Inscrire automatiquement les {classStudents.length} etudiant{classStudents.length > 1 ? 's' : ''} de la classe
            </label>
          </div>
        )}

        {/* Programme */}
        {programs.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Programme</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#002F5D] focus:border-transparent"
              value={formData.program_id}
              onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
            >
              <option value="">-- Aucun programme --</option>
              {programs.map((p: { id: string; name: string }) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Error global */}
        {createMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Une erreur est survenue lors de la création. Veuillez réessayer.
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-[#002F5D] text-white rounded-lg hover:bg-[#001B39] transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Création en cours...' : 'Créer la session'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [details, setDetails] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🧪 Test de connexion Supabase...');
      
      // Test 1: Connexion de base
      const { error: healthError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        console.error('❌ Erreur de connexion:', healthError);
        setConnectionStatus('error');
        setDetails(`Erreur de connexion: ${healthError.message}`);
        return;
      }

      console.log('✅ Connexion Supabase OK');

      // Test 2: Lister les tables disponibles
      const { error: tablesError } = await supabase
        .rpc('get_schema_tables');

      if (tablesError) {
        console.warn('⚠️ Impossible de lister les tables:', tablesError);
      }

      // Test 3: Vérifier les tables principales
      const testTables = ['profiles', 'training_sessions', 'rooms', 'programs'];
      const availableTables: string[] = [];

      for (const table of testTables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('count', { count: 'exact', head: true });
          
          if (!error) {
            availableTables.push(table);
          } else {
            console.warn(`⚠️ Table ${table} non accessible:`, error.message);
          }
        } catch (e) {
          console.warn(`⚠️ Table ${table} introuvable`);
        }
      }

      setTables(availableTables);
      setConnectionStatus('success');
      setDetails(`Tables disponibles: ${availableTables.join(', ')}`);

    } catch (error) {
      console.error('💥 Erreur test connexion:', error);
      setConnectionStatus('error');
      setDetails(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing': return 'Test en cours...';
      case 'success': return 'Connexion OK';
      case 'error': return 'Erreur de connexion';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'testing': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        🔧 Test Connexion Supabase
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <p className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-neutral-600">
              {details}
            </p>
          </div>
        </div>

        {connectionStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">
              Configuration Supabase
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <div>URL: {import.meta.env.VITE_SUPABASE_URL}</div>
              <div>Clé: {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...</div>
              <div>Tables: {tables.length} détectées</div>
            </div>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-800 mb-2">
              Problème de Configuration
            </p>
            <div className="text-xs text-red-700 space-y-1">
              <div>Vérifiez vos variables d'environnement</div>
              <div>URL: {import.meta.env.VITE_SUPABASE_URL || '❌ Manquant'}</div>
              <div>Clé: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Présente' : '❌ Manquante'}</div>
            </div>
          </div>
        )}

        <button 
          onClick={testConnection}
          disabled={connectionStatus === 'testing'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {connectionStatus === 'testing' ? 'Test en cours...' : 'Retester la connexion'}
        </button>
      </div>
    </div>
  );
};
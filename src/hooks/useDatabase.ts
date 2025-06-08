import { useState, useEffect } from 'react';
import { db } from '@/db/database';
import { DataSeeder } from '@/db/seeder';

interface DatabaseState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useDatabase = (seedData = false) => {
  const [state, setState] = useState<DatabaseState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Initialize database
        await db.initialize();

        // Seed data if requested
        if (seedData) {
          await DataSeeder.seedAll();
        }

        setState({
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isInitialized: false,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Database initialization failed',
        });
      }
    };

    initializeDatabase();
  }, [seedData]);

  const reinitialize = async (withSeeding = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await db.initialize();

      if (withSeeding) {
        await DataSeeder.seedAll();
      }

      setState({
        isInitialized: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        isInitialized: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Database reinitialization failed',
      });
    }
  };

  const clearAndSeed = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await db.clearDatabase();
      await DataSeeder.seedAll();

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Database clear and seed failed',
      }));
    }
  };

  return {
    ...state,
    reinitialize,
    clearAndSeed,
  };
};

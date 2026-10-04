import { useEffect, useState } from 'react';
import { getProfile, getProjects } from '../services/projectsService.js';

/** Loads profile and projects together. Returns { profile, projects, loading, error }. */
export function useProjects() {
  const [state, setState] = useState({ profile: null, projects: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProfile(), getProjects()])
      .then(([profile, projects]) => {
        if (!cancelled) setState({ profile, projects, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

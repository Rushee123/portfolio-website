// Phase 2 source: our own FastAPI backend behind nginx at /api.
// The backend must return the normalized Profile / Project shapes from projectsService.js.
async function getJson(path) {
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
}

export function fetchProfile() {
  return getJson('/profile');
}

export function fetchProjects() {
  return getJson('/projects');
}

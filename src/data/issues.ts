/**
 * LEGACY FILE - DEPRECATED
 *
 * This file previously contained hardcoded issue definitions.
 *
 * As of the backend-first issue management implementation, issue data
 * is now served from the Flask backend as the single source of truth.
 *
 * All issue data is now fetched from the backend via:
 * - Backend: /api/issues endpoint
 * - Frontend: apiClient.getIssues() method
 * - State: useAppState hook manages issues loading
 *
 * This file is kept for documentation purposes but should not be imported.
 * If you need issue data, use the app state: const { issues } = useAppState();
 *
 * Migration completed: [date]
 * - Backend data_store.py now stores complete issue objects
 * - Frontend components updated to use dynamic issues
 * - Static imports removed from all screens
 */

// This export is deprecated and should not be used
// @deprecated Use useAppState().state.issues instead
export const LEGACY_ISSUES_NOTICE = {
  message: "This file is deprecated. Issue data is now managed by the backend.",
  migration: "Use useAppState().state.issues to access current issues",
  backend_endpoint: "/api/issues"
};
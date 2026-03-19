/**
 * Packing App API Client (stub)
 * ------------------------------
 * This file defines the same functions/signatures as `mockApi.js`, so you can
 * swap out sample data for real backend calls later without rewriting any
 * screen renderers.
 *
 * For now, it simply forwards to `PackingAppMockApi`.
 */
(function () {
  const ns = {};

  function requireMock() {
    if (!window.PackingAppMockApi) {
      throw new Error("PackingAppMockApi missing; ensure mockApi.js loads before apiClient.js.");
    }
    return window.PackingAppMockApi;
  }

  ns.getTrips = function () {
    return requireMock().getTrips();
  };

  ns.getChecklist = function (tripId, checklistPersistence) {
    return requireMock().getChecklist(tripId, checklistPersistence);
  };

  ns.getForecast = function (tripId) {
    return requireMock().getForecast(tripId);
  };

  ns.getSharedTrip = function (tripId, sharedPersistence, checklist) {
    return requireMock().getSharedTrip(tripId, sharedPersistence, checklist);
  };

  ns.getInspiration = function () {
    return requireMock().getInspiration();
  };

  window.PackingAppApiClient = ns;
})();


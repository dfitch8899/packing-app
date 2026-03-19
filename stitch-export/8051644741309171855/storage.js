(function () {
  const ns = {};
  const { storageKeys } = window.PackingAppUIContract || { storageKeys: null };

  if (!storageKeys) {
    // eslint-disable-next-line no-console
    console.warn("PackingAppUIContract missing; storage.js expects uiContract.js to load first.");
  }

  function safeJsonParse(raw, fallback) {
    try {
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function readChecklistPersistence(tripId) {
    const key = storageKeys.checklistStatePrefix + tripId;
    return safeJsonParse(localStorage.getItem(key), {
      itemPackedById: {},
      customItems: [],
    });
  }

  function writeChecklistPersistence(tripId, data) {
    const key = storageKeys.checklistStatePrefix + tripId;
    localStorage.setItem(key, JSON.stringify(data));
  }

  function readSharedPersistence(tripId) {
    const key = storageKeys.sharedStatePrefix + tripId;
    return safeJsonParse(localStorage.getItem(key), {
      commonItemById: {},
    });
  }

  function writeSharedPersistence(tripId, data) {
    const key = storageKeys.sharedStatePrefix + tripId;
    localStorage.setItem(key, JSON.stringify(data));
  }

  ns.getSelectedTripId = function () {
    return localStorage.getItem(storageKeys.selectedTripId) || "";
  };

  ns.setSelectedTripId = function (tripId) {
    localStorage.setItem(storageKeys.selectedTripId, String(tripId || ""));
  };

  ns.getViewerParticipantId = function () {
    return localStorage.getItem(storageKeys.viewerParticipantId) || "p_alice";
  };

  ns.setViewerParticipantId = function (participantId) {
    localStorage.setItem(storageKeys.viewerParticipantId, String(participantId || ""));
  };

  ns.loadChecklistPersistence = function (tripId) {
    return readChecklistPersistence(tripId);
  };

  ns.setChecklistItemPacked = function (tripId, itemId, isPacked) {
    const state = readChecklistPersistence(tripId);
    state.itemPackedById = state.itemPackedById || {};
    state.itemPackedById[itemId] = Boolean(isPacked);
    writeChecklistPersistence(tripId, state);
  };

  ns.addCustomChecklistItem = function (tripId, item) {
    const state = readChecklistPersistence(tripId);
    state.customItems = state.customItems || [];
    state.customItems.push(item);
    state.itemPackedById = state.itemPackedById || {};
    state.itemPackedById[item.id] = Boolean(item.isPacked);
    writeChecklistPersistence(tripId, state);
  };

  ns.loadSharedPersistence = function (tripId) {
    return readSharedPersistence(tripId);
  };

  ns.claimCommonItem = function (tripId, commonItemId, viewerParticipantId) {
    const state = readSharedPersistence(tripId);
    state.commonItemById = state.commonItemById || {};
    state.commonItemById[commonItemId] = {
      assignedToParticipantId: viewerParticipantId,
      status: "READY",
    };
    writeSharedPersistence(tripId, state);
  };

  ns.getCommonItemOverride = function (tripId, commonItemId) {
    const state = readSharedPersistence(tripId);
    return state.commonItemById && state.commonItemById[commonItemId]
      ? state.commonItemById[commonItemId]
      : null;
  };

  window.PackingAppStorage = ns;
})();


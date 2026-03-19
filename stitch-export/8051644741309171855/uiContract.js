/**
 * Packing App UI Contract
 * -----------------------
 * This project’s Stitch-export prototypes are static HTML. To make them backend-ready,
 * we define a small UI contract that both:
 *  - `mockApi.js` (sample data while backend is not implemented)
 *  - `apiClient.js` (later swap-in for real backend)
 * can return consistently.
 *
 * The runtime code in `appBootstrap.js` + screen renderers relies on these shapes.
 */
(function () {
  // Namespace to avoid polluting the global scope too much.
  const ns = {};

  /**
   * @typedef {Object} Trip
   * @property {string} id
   * @property {string} destinationName
   * @property {string} dateRangeText
   * @property {string} heroImageUrl
   * @property {string=} heroImageAlt
   */

  /**
   * @typedef {Object} ChecklistItem
   * @property {string} id
   * @property {string} label
   * @property {number} quantity
   * @property {boolean} isPacked
   * @property {string=} assignedToParticipantId
   * @property {boolean=} isCustom
   */

  /**
   * @typedef {Object} ChecklistCategory
   * @property {string} id
   * @property {string} title
   */

  /**
   * @typedef {Object} Checklist
   * @property {string} tripId
   * @property {ChecklistCategory[]} categories
   * @property {Array<{ categoryId: string, items: ChecklistItem[] }>} itemsByCategory
   * @property {ChecklistItem[]} customItems
   */

  /**
   * @typedef {Object} ForecastDay
   * @property {string} labelText  // e.g. "Mon, Oct 12"
   * @property {string} iconName   // maps to Material icon (data-icon)
   * @property {number} rainChance // 0-100
   * @property {number} highC
   * @property {number} lowC
   * @property {string} rainText     // e.g. "20% Rain"
   */

  /**
   * @typedef {Object} Forecast
   * @property {string} tripId
   * @property {string} headerTitle  // e.g. "Kyoto Forecast"
   * @property {string} dateRangeText // e.g. "OCT 12 — 24"
   * @property {{ temperatureC: number, summaryText: string, humidityText: string }} currentConditions
   * @property {ForecastDay[]} sevenDayOutlook
   * @property {Array<{ iconName: string, title: string, body: string }>} packingStrategyBlocks
   * @property {string[]} recommendedItems
   */

  /**
   * @typedef {Object} Participant
   * @property {string} id
   * @property {string} name
   * @property {string} roleTitle
   * @property {number} packedPercent  // computed for UI
   */

  /**
   * @typedef {Object} SharedCommonItem
   * @property {string} id
   * @property {string} title
   * @property {string=} assignedToParticipantId
   * @property {"READY"|"PENDING"} status
   */

  /**
   * @typedef {Object} SharedTrip
   * @property {string} tripId
   * @property {string} tripTitleText
   * @property {Participant[]} participants
   * @property {SharedCommonItem[]} commonItems
   */

  /**
   * @typedef {Object} InspirationDestination
   * @property {string} id
   * @property {string} tripId
   * @property {string} destinationLabel
   * @property {string} destinationTitle
   * @property {string} description
   * @property {string} imageUrl
   * @property {string=} imageAlt
   */

  /**
   * @typedef {Object} Inspiration
   * @property {InspirationDestination[]} destinations
   */

  // LocalStorage keys shared by storage + bootstrapping.
  ns.storageKeys = {
    viewerParticipantId: "packingApp.viewerParticipantId",
    selectedTripId: "packingApp.selectedTripId",
    checklistStatePrefix: "packingApp.checklistState.", // + tripId
    sharedStatePrefix: "packingApp.sharedState.", // + tripId
    customItemsPrefix: "packingApp.customItems.", // + tripId
  };

  ns.urlParams = {
    tripId: "tripId",
  };

  ns.contractVersion = "1";

  window.PackingAppUIContract = ns;
})();


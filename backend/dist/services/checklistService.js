"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checklistService = void 0;
const inMemoryStore_1 = require("../store/inMemoryStore");
exports.checklistService = {
    getChecklist(tripId, categoryId) {
        return inMemoryStore_1.inMemoryStore.getTripChecklist(tripId, categoryId);
    },
    addCustomItem(tripId, input) {
        const item = inMemoryStore_1.inMemoryStore.addChecklistItem(tripId, input);
        return item;
    },
    setItemCompleted(tripId, itemId, completed) {
        return inMemoryStore_1.inMemoryStore.patchChecklistItem(tripId, itemId, { completed });
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspirationService = void 0;
const inMemoryStore_1 = require("../store/inMemoryStore");
exports.inspirationService = {
    list(destination) {
        return inMemoryStore_1.inMemoryStore.listInspirations(destination);
    },
};

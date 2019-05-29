"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const syncController_1 = __importDefault(require("../controllers/syncController"));
class SyncRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', syncController_1.default.sync);
    }
}
const syncRoutes = new SyncRoutes();
exports.default = syncRoutes.router;

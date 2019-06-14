"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author: Thiago Cortez
 */
const fs = __importStar(require("fs"));
// Dependencias
let configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
module.exports = parsed;

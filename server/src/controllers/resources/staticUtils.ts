/**
 * Author: Thiago Cortez
 */
import * as fs from "fs";

// Dependencias
let configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
module.exports = parsed;
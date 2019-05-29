"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dadosController_1 = __importDefault(require("../controllers/dadosController"));
class DadosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', dadosController_1.default.list);
        this.router.get('/:idEndp', dadosController_1.default.getOne);
        this.router.post('/', dadosController_1.default.create);
        this.router.put('/:idEndp', dadosController_1.default.update);
        this.router.delete('/:idEndp', dadosController_1.default.delete);
    }
}
const dadosRoutes = new DadosRoutes();
exports.default = dadosRoutes.router;

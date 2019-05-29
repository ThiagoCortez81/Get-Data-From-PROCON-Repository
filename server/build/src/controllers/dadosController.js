"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class DadosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const dados = database_1.default.query('SELECT * FROM reclamacoesEndpoint', (error, result, fields) => {
                    resolve(result);
                });
            }).then(dados => {
                res.json(dados);
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEndp } = req.params;
            return new Promise((resolve, reject) => {
                const dadoOne = database_1.default.query('SELECT * FROM reclamacoesEndpoint WHERE idEndp = ?', [idEndp], function (error, result, fields) {
                    resolve(result[0]);
                });
            }).then(dadoOne => {
                if (dadoOne != null)
                    return res.json(dadoOne);
                res.status(404).json({ text: 'Reclamação não existe !' });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.query('INSERT INTO reclamacoesEndpoint SET ?', [req.body], (error, result, fields) => {
                    if (error)
                        resolve(true);
                    else
                        resolve(false);
                });
            }).then(err => {
                if (!err)
                    res.json({ message: 'Inserido no banco' });
                else
                    res.json({ message: 'Erro ao inserir no banco' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const { idEndp } = req.params;
                database_1.default.query('UPDATE reclamacoesEndpoint SET ? WHERE idEndp = ?', [req.body, idEndp], (error, result, fields) => {
                    if (error)
                        resolve(true);
                    else
                        resolve(false);
                });
            }).then(err => {
                if (!err)
                    res.json({ message: 'Update sucess' });
                else
                    res.json({ message: 'Update error' });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const { idEndp } = req.params;
                database_1.default.query('DELETE FROM reclamacoesEndpoint WHERE idEndp = ?', [idEndp], (error, result, fields) => {
                    if (error)
                        resolve(true);
                    else
                        resolve(false);
                });
            }).then(err => {
                if (!err)
                    res.json({ message: 'Reclamação deletada com sucesso!' });
                else
                    res.json({ message: 'Erro ao deletar reclamação!' });
            });
        });
    }
}
const dadosController = new DadosController();
exports.default = dadosController;

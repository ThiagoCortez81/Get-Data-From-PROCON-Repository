"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dadoRoutes_1 = __importDefault(require("./routes/dadoRoutes"));
const syncRoutes_1 = __importDefault(require("./routes/syncRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(express_1.default.static('../client/dist')); //Estaticos ng
        this.app.use('/api/dados', dadoRoutes_1.default);
        this.app.use('/sync', syncRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Serve on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();

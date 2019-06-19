import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from './routes/indexRoutes';
import dadoRoutes from './routes/dadoRoutes';
import syncRoutes from "./routes/syncRoutes";

class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.set('timeout', (30 * 60000));
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void {
        this.app.use('/api/dados', dadoRoutes);
        this.app.use('/sync', syncRoutes);

        //Configurações para frontend em angular
        this.app.use(express.static('../client/dist')); //Estaticos ng
        this.app.all('*', function (req, res) {
            res.status(200).sendFile(`/`, {root: '../client/dist'});
        });
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Serve on port', this.app.get('port'));
        });
    }



    //TODO TESTAR APÓS CONVERSÃO
}

const server = new Server();
server.start();
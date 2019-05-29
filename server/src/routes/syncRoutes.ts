import{ Router }from 'express';
import syncController from "../controllers/syncController";

class SyncRoutes{

    public router : Router = Router();

    constructor(){
        this.config();
    } 

    config(): void{
        this.router.post('/',syncController.sync);
    }
}

const syncRoutes = new SyncRoutes();
export default syncRoutes.router;
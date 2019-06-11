import{ Router }from 'express';
import dadosController from '../controllers/dadosController';

class DadosRoutes{

    public router : Router = Router();

    constructor(){
        this.config();
    } 

    config(): void{
        this.router.get('/',dadosController.list);
        this.router.get('/:id_endp',dadosController.getOne);
        this.router.post('/',dadosController.create);
        this.router.put('/:id_endp',dadosController.update);
        this.router.delete('/:id_endp',dadosController.delete);
    }
}

const dadosRoutes = new DadosRoutes();
export default dadosRoutes.router;
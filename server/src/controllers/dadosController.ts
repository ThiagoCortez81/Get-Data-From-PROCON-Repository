import {Request, Response} from 'express';

import pool from '../database';


class DadosController {
    public async list(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const dados = pool.query('SELECT * FROM reclamacoes_endpoint', (error, result, fields) => {
                resolve(result);
            });
        }).then(dados => {
            res.json(dados);
        })
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const {id_endp} = req.params;
        return new Promise((resolve, reject) => {
            const dadoOne = pool.query('SELECT * FROM reclamacoes_endpoint WHERE id_endp = ?', [id_endp], function (error, result, fields) {
                resolve(result[0]);
            });
        }).then(dadoOne => {
            if (dadoOne != null)
                return res.json(dadoOne);

            res.status(404).json({text: 'Reclamação não existe !'});
        });
    }

    public async create(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO reclamacoes_endpoint SET ?', [req.body], (error, result, fields) => {
                if (error)
                    resolve(true);
                else
                    resolve(false);
            });
        }).then(err => {
            if (!err)
                res.json({message: 'Inserido no banco'});
            else
                res.json({message: 'Erro ao inserir no banco'});
        });
    }

    public async update(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            const {id_endp} = req.params;
            pool.query('UPDATE reclamacoes_endpoint SET ? WHERE id_endp = ?', [req.body, id_endp], (error, result, fields) => {
                if (error)
                    resolve(true);
                else
                    resolve(false);
            });
        }).then(err => {
            if (!err)
                res.json({message: 'Update sucess'});
            else
                res.json({message: 'Update error'});
        });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            const {id_endp} = req.params;
            pool.query('DELETE FROM reclamacoes_endpoint WHERE id_endp = ?', [id_endp], (error, result, fields) => {
                if (error)
                    resolve(true);
                else
                    resolve(false);
            });
        }).then(err => {
            if (!err)
                res.json({message: 'Reclamação deletada com sucesso!'});
            else
                res.json({message: 'Erro ao deletar reclamação!'});
        });
    }

}

const dadosController = new DadosController();
export default dadosController

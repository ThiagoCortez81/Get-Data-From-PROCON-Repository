import DateTimeFormat = Intl.DateTimeFormat;

const mongoose = require('mongoose');
const Consumidores = require('./Consumidores');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const Reclamacoes = new Schema({
    data_arquivamento: String,
    data_abertura: String,
    regiao: String,
    uf: String,
    ano_calendario: Number,
    atendida: String,
    codigo_assunto: String,
    descricao_assunto: String,
    codigo_problema: String,
    descricao_problema: String,
    cnae_principal_empresa: String,
    tipo: String,
    razao_social: String,
    nome_fantasia: String,
    documento: String,
    consumidor: {
        faixa_etaria: String,
        sexo: String,
        cep: String
    }
});
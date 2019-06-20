import {Endpoints} from "../Endpoints";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const SyncAuditoria = new Schema({
    data_sync: Date,
    endpoint_sync: String
});

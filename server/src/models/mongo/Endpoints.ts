const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const EndpointsSchema = new Schema({
    url_end: String,
    url_endp_real: String,
    created_at: String,
    titulo: String
});

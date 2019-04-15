const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const aspiranteSchema = new Schema({
	nombre : {
		type : String,
		required : true	,
		trim : true
	},
	documento :{
		type : String,
		required : true
	},
	correo : {
		type: String,
		required : true		
	},
	telefono : {
		type: Number,
		required : true				
	},
	idcurso : {
		type: Number					
	}
});

aspiranteSchema.plugin(uniqueValidator);

const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante
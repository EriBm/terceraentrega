const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
	nombre : {
		type : String,
		required : true
	},
	usuario : {
		type : String,
		required : true	,
		trim : true
	},
	password :{
		type : String,
		required : true
	},
	documento : {
		type: Number,
		required : true,
		isUnique: true		
	},
	correo : {
		type: String,
		required : true				
	},
	telefono : {
		type: Number,
		required : true

	},
	rol : {
		type: String,
		default : 'aspirante'

	}
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario
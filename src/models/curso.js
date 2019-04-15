const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursoSchema = new Schema({
	nombre : {
		type : String,
		required : true,
		trim : true
	},
	idcurso :{
		type : Number,
		required : true,
		isUnique: true
	},
	valor : {
		type: Number,
		default: 0,
		required : true
	},
	descripcion : {
		type: String,
		required : true				
	},
	modalidad : {
		type: String				
	},
	intensidad : {
		type: String				
	},
	estado : {
		type: String,
		default: 'disponible'				
	},
	inscritos: [{
		documento: String
		//type: mongoose.Schema.Types.ObjectId,
		//ref: 'Aspirante'
	  }]
});

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso
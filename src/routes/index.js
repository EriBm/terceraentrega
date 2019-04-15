const express = require('express')
const app = express ()
const path = require('path')
const hbs = require ('hbs')
const Curso = require('./../models/curso')
const Usuario = require('./../models/usuario')
const Aspirante = require('./../models/aspirante')
const dirViews = path.join(__dirname, '../../template/views')
const dirPartials = path.join(__dirname, '../../template/partials')
const bcrypt = require('bcrypt');

require('./../helpers/helpers')

//hbs
app.set('view engine', 'hbs')
app.set('views', dirViews)
hbs.registerPartials(dirPartials)


app.get('/', (req, res ) => {
	res.render('index', {
	})	
})

app.get('/iniciosesion', (req, res ) => {
	res.render('iniciosesion', {
	})	
})

app.get('/registrarse', (req, res ) => {
	res.render('registrarusuario', {
	})	
})

app.post('/registrarse', (req, res ) => {

	let usuario = new Usuario ({
		documento : req.body.documento,
		nombre : req.body.nombre,
		correo : req.body.correo,
		telefono : 	req.body.telefono,
		password : bcrypt.hashSync(req.body.password, 10)
		
	})

	usuario.save((err, resultado) => {
		if (err){
			return res.render ('indexpost', {
				mostrar : err
			})			
		}
		
		//Para crear las variables de sesión
		req.session.usuario = resultado._id	
		req.session.nombre = resultado.nombre
		req.session.rol = resultado.rol
		res.render ('indexpost', {			
				mostrar : 'Se ha registrado exitosamente'
			})		
	})	
})


//nuevo
app.get('/registrar', (req, res ) => {
	res.render('registrarcurso', {
		titulo: 'nuevo curso',
	})	
})

app.post('/registrar', (req, res ) => {

	let curso = new Curso ({
		nombre : req.body.nombre,
		idcurso : req.body.idcurso,
		descripcion : req.body.descripcion,
		valor : 	req.body.valor,
		modalidad : 	req.body.modalidad,
		intensidad : 	req.body.intensidad
	})

	curso.save((err, resultado) => {
		if (err){
			return res.render ('indexcurso', {
				mostrar : err
			})			
		}		
		res.render ('indexcurso', {			
				mostrar : resultado.nombre
			})		
	})
})

app.get('/verinscritos', (req,res) => {

	Curso.aggregate([
		{ $lookup:
		   {
			 from: 'aspirante',
			 localField: 'idcurso',
			 foreignField: 'idcurso',
			 as: 'inscritos'
		   }
		 }
	 ]).exec(function(err, results){
		console.log(JSON.stringify(results));
		res.render ('verinscritos',{
			inscritos : results
		})
	 })

	
})//cierre funcion

app.get('/vercursos', (req,res) => {

	Curso.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('vercursos',{
			cursos : respuesta
		})
	})
})

app.get('/actualizar', (req, res) => {	

		Usuario.findById(req.session.usuario, (err, usuario) =>{
			//Estudiante.findById(req.usuario, (err, usuario) =>{
			if (err){
				return console.log(err)
			}

			if (!usuario){
			return res.redirect('/')
		}
			res.render ('actualizar',{
				documento : req.body.documento,
				nombre : req.body.nombre,
				correo : req.body.correo,
				telefono : 	req.body.telefono,
				rol: req.body.rol
			})
		});
	})	

app.post('/actualizar', (req, res) => {
	
	Usuario.findOneAndUpdate({documento : req.body.documento}, req.body, {new : true, runValidators: true, context: 'query' }, (err, resultados) => {
		if (err){
			return console.log(err)
		}

		res.render ('actualizar', {
			documento : req.body.documento,
			nombre : req.body.nombre,
			correo : req.body.correo,
			telefono : 	req.body.telefono,
			rol: req.body.rol
		})
	})	
})

app.post('/vercurso', (req, res) => {	
	Curso.findById(req.body.id, (err, curso) =>{
		if (err){
			return console.log(err)
		}

		res.render ('vercurso',{
			descripcion : curso.descripcion,
			modalidad : 	curso.modalidad,
			intensidad : 	curso.intensidad,
			idcurso: curso.idcurso
		})
	});
})

app.post('/inscribirse', (req, res) => {	
	res.render('inscribirse', {
		idcurso: req.body.idcurso,
		titulo: 'inscribirse en el curso',
	})
})

app.post('/inscribircurso', (req, res) => {
	Curso.findOne({ idcurso: req.body.idcurso }).
	exec(function (err, encontrado) {
		if (err) return handleError(err);
			if( encontrado.inscritos.documento == req.body.documento){
				return res.render ('indexcurso', {
					mostrar : "Ya se encuentra inscrito en el curso seleccionado"			
				})
			}else{
				let aspirante = new Aspirante ({
					documento : req.body.documento,
					nombre : req.body.nombre,
					correo : req.body.correo,
					telefono : 	req.body.telefono,
					idcurso : 	req.body.idcurso
				})
			
				aspirante.save((err, resultadoins) => {
					if (err){
						return res.render ('indexcurso', {
							mostrar : err
						})			
					}

					/* Curso.findOneAndUpdate({idcurso : req.body.idcurso}, 
						{ $addToSet : { inscritos : new ObjectId(resultadoins._id) } }, {runValidators: true, context: 'query' }, (err, resultados) => {
						if (err){
							return console.log(err)
						}
					})	 */

					Curso.findOneAndUpdate({idcurso : req.body.idcurso}, 
						{ $addToSet : { inscritos : req.body.documento } }, {runValidators: true, context: 'query' }, (err, resultados) => {
						if (err){
							return console.log(err)
						}

						res.render ('indexcurso', {
							mostrar : "Inscripcion exitosa, le enviaremos un correo con la informacion del curso"			
						})
					})
					
							
				})
			}
  });
	
})

app.post('/eliminar', (req, res) => {
	
	Aspirante.findOneAndDelete({documento : req.body.documento}, req.body, (err, resultados) => {
		if (err){
			return console.log(err)
		}

		if(!resultados){
			res.render ('eliminar', {
			nombre : "no encontrado"			
		})

		}

		res.render ('eliminar', {
			nombre : resultados.nombre			
		})
	})	
})


app.post('/ingresar', (req, res) => {	
	Usuario.findOne({documento : req.body.documento}, (err, resultados) => {
		if (err){
			return console.log(err)
		}
		if(!resultados){
			return res.render ('ingresar', {
			mensaje : "Usuario no encontrado"			
			})
		}
		if(!bcrypt.compareSync(req.body.password, resultados.password)){
			return res.render ('ingresar', {
			mensaje : "Contraseña no es correcta"			
			})
		}	
			//Para crear las variables de sesión
			req.session.usuario = resultados._id	
			req.session.nombre = resultados.nombre
			req.session.rol = resultados.rol

		if(resultados.rol=='aspirante'){
			rolaspirante:true
		}else{
			rolcoordinador:true
		}
			
			res.render('ingresar', {
						mensaje : "Bienvenido " + resultados.nombre,
						nombre : resultados.nombre,
						rolaspirante: true,
						sesion : true						
						 })
	})	
})

app.get('/salir', (req, res) => {
	req.session.destroy((err) => {
  		if (err) return console.log(err) 	
	})
	res.redirect('/')	
})

app.get('*',(req,res)=> {
	res.render('error', {
		titulo: "Error 404",		
	})
});

module.exports = app
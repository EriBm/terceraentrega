const hbs = require('hbs');

hbs.registerHelper('listar', (listado) => {
let texto = `	<form action="/eliminar" method="post">
		<table class='table table-striped table-hover'> 
				<thead class='thead-dark'>
				<th>Nombre</th>
				<th>Matematicas</th>
				<th>Ingles</th>
				<th>Programacion</th>
				<th></th>
				</thead>
				<tbody>`;
	listado.forEach(estudiante =>{
		texto = texto + 
				`<tr>
				<td> ${estudiante.nombre} </td>
				<td> ${estudiante.matematicas} </td>
				<td> ${estudiante.ingles}</td>
				<td> ${estudiante.programacion} </td>
				<td><button class="btn btn-danger" name="nombre" value="${estudiante.nombre}">Eliminar</button></td>
				
				</tr> `;
	})
	texto = texto + '</tbody> </table></form>';	
	return texto;

});


hbs.registerHelper('listar', (cursos) => {
	let texto = `	<form action="/vercurso" method="post">
			<table class='table table-striped table-hover'> 
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Descripcion</th>
					<th>Valor</th>
					<th>Estado</th>
					<th></th>
					</thead>
					<tbody>`;
		cursos.forEach(curso =>{
			texto = texto + 
					`<tr>
					<td> ${curso.nombre} </td>
					<td> ${curso.descripcion}</td>
					<td> ${curso.valor} </td>
					<td> ${curso.estado} </td>
					<td><button class="btn btn-dark" name="id" value="${curso._id}">Ver detalle</button></td>
					
					</tr> `;
		})
		texto = texto + '</tbody> </table></form>';	
		return texto;
	
	});

	


	

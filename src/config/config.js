process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	//urlDB = 'mongodb://localhost:27017/asignaturas';
	urlDB = 'mongodb+srv://eriadmin:1I2wZVAxd98bc1qQ@nodejstdea-ui8qm.mongodb.net/asignaturas?retryWrites=true';
}
else {
	urlDB = 'mongodb+srv://eriadmin:1I2wZVAxd98bc1qQ@nodejstdea-ui8qm.mongodb.net/asignaturas?retryWrites=true';
}

process.env.URLDB = urlDB
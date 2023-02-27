var db; var app = new Vue ({
    el: '#app',

data: {
    forms:{
        docente     : {mostrar:false},
        alumno      : {mostrar:false},
        materia     : {mostrar:false},
        matricula   : {mostrar:false},
        inscribir : {mostrar:false},
    }

},
methods:{
    abrirFormulario(form) {
        for (var key in this.forms) {
            if (key !== form) {
                this.forms[key].mostrar = false;
            }
        }
        this.forms[form].mostrar = !this.forms[form].mostrar;
        this.$refs[form].listar();
        this.$refs[form].listarAlumnos();
    },
    
    abrirBD(){
        let indexDB = indexedDB.open('Sistema_Academico',1);
        indexDB.onupgradeneeded=e=>{
            let req = e.target.result,
                tbldocente = req.createObjectStore('tbldocentes', {keyPath:'idDocente'}),
                tblalumno = req.createObjectStore('tblalumnos',{keyPath:'idAlumno'}),
                tblmateria = req.createObjectStore('tblmaterias',{keyPath:'idMateria'});
                tblmatricula = req.createObjectStore('tblmatricula',{keyPath:'idMatricula'});
                tblinscripcion = req.createObjectStore('tblinscritos',{keyPath:'idInscrito'});

            
            
            tbldocente.createIndex('idDocente', 'idDocente', {unique:true});
            tblalumno.createIndex('idAlumno', 'idAlumno', {unique:true});
            tblmateria.createIndex('idMateria', 'idMateria', {unique:true});
            tblinscripcion.createIndex('idInscrito', 'idInscrito', {unique:true});
        };
        indexDB.onsuccess= e=>{
            db = e.target.result;
        };
        indexDB.onerror= e=>{
            console.error( e );
        };
    }, 
},
created() {
    this.abrirBD();
}
});



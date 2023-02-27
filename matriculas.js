Vue.component('component-matriculas',{
    
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            alumnos:[],
            matriculas: [],
            matricula:{
            idMatricula : '',
            nombre:'',
            fechadematri : '',
            carrera : '',


            }
        }
    },
    methods:{
        guardarMatricula(){
            let store = this.abrirStore('tblmatricula', 'readwrite');
            if(this.accion==='nuevo'){
                this.matricula.idMatricula = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.matricula) ) );
            this.listar();
            this.nuevoMatricula();
        },
        eliminarMatricula(matricula){
            if( confirm(`Esta seguro de eliminar a ${matricula.nombre}?`) ){
                let store = this.abrirStore('tblmatricula', 'readwrite'),
                    req = store.delete(matricula.idMatricula);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoMatricula(){
            this.accion = 'nuevo';
            this.matricula.idMatricula = '';
            this.matricula.nombre = '';
            this.matricula.fechadematri = '';
            this.matricula.carrera = '';
            
        },
        modificarMatricula(matricula){
            this.accion = 'modificar';
            this.matricula = matricula;
        },
        listar(){
            let store = this.abrirStore('tblmatricula', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.matriculas = data.result
                .filter(matricula=>matricula.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                matricula.codigo.indexOf(this.buscar)>-1 ||
                matricula.nombre.indexOf(this.buscar)>-1
              );
            };
        },
        listarAlumnos(){
            let store = this.abrirStore('tblalumnos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.alumnos = data.result
                
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('Sistema_Academico',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblmatricula = req.createObjectStore('tblmatricula', {keyPath:'idMatricula'});
                    

                tblmatricula.createIndex('idMatricula', 'idMatricula', {unique:true});
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
                this.listar();
                this.listarAlumnos();
            };
            indexDB.onerror= e=>{
                console.error( e );
            };
        },
    },
    created(){
        this.abrirBD();
    },


    template: `
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header">REGISTRO DE MATRICULAS</div>
                    <div class="card-body">
                        <form id="frmMatricula" @reset.prevent="nuevoMatricula" v-on:submit.prevent="guardarMatricula">

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtRegAlm">Alumnos Registrados:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                <select class="form-control" v-model="matricula.nombre">
                                <option v-for="alumno in alumnos" :value="alumno.codigo">{{ alumno.codigo }} - {{alumno.nombre}}</option>
                                </select>
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtFechaMatricula">Fecha de matricula :</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required 
                                        v-model="matricula.fechadematri" type="date" class="form-control" name="txtFechadematriMatricula" id="txtFechadematriMatricula">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtCorreoMatricula">Correo:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú-@ ]{3,75}"
                                        v-model="matricula.correo" type="text" class="form-control" name="txtCorreoMatricula" id="txtCorreoMatricula">
                                </div>
                            </div>
                            
                            <div class="row p-1">
                            <div class="col-3 col-md-4">
                              <label for="carrera">Carrera:</label>
                            </div>
                            <div class="col-6 col-md-6">
                              <select v-model="matricula.carrera" name="txtCarreraMatricula" id="txtCarreraMatricula">
                                <option value="" disabled>Selecciona tu carrera</option>
                                <option value="Derecho">Derecho</option>
                                <option value="Relaciones Internacionales">Relaciones Internacionales</option>
                                <option value="Comunicación y Periodismo">Comunicación y Periodismo</option>
                                <option value="Mercadotecnia">Mercadotecnia</option>
                                <option value="Ingenieria en Sistema y Redes Informaticas">Ingenieria en Sistema y Redes Informaticas</option>
                                
                              </select>
                            </div>
                          </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-6">
                                    <input class="btn btn-primary" type="submit" 
                                        value="Guardar">
                                </div>
                                <div class="col-3 col-md-3">
                                    <input class="btn btn-warning" type="reset" value="Nuevo">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-header">LISTADO DE MATRICULAS</div>
                    <div class="card-body">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>BUSCAR:</th>
                                    <th colspan="2"><input type="text" class="form-control" v-model="buscar"
                                        @keyup="listar()"
                                        placeholder="Buscar por codigo o nombre"></th>
                                </tr>
                                <tr>
                                    <th>Alumno</th>
                                    <th>FECHA DE MATRICULA</th>
                                    <th>CORREO</th>
                                    <th>CARRERA</th>


                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)" >
                                    <td>{{ matricula.nombre }}</td>
                                    <td>{{ matricula.fechadematri }}</td>
                                    <td>{{ matricula.correo}}</td>
                                    <td>{{ matricula.carrera }}</td>

                                    <td><button class="btn btn-danger" @click="eliminarMatricula(matricula)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});






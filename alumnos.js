Vue.component('component-alumnos',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            alumnos: [],
            alumno:{
                idAlumno : '',
                codigo : '',
                nombre : '',
                direccion : '',
                fecha : '',

                municipio : '',
                departamento : '',
                telefono : '',
                dui : '',
                sexo : '',
            }
        }
    },
    methods:{
        guardarAlumno(){
            let store = this.abrirStore('tblalumnos', 'readwrite');
            if(this.accion==='nuevo'){
                this.alumno.idAlumno = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.alumno) ) );
            this.listarAlumnos();
            this.nuevoAlumno();
        },
        eliminarAlumno(alumno){
            if( confirm(`Esta seguro de eliminar a ${alumno.nombre}?`) ){
                let store = this.abrirStore('tblalumnos', 'readwrite'),
                    req = store.delete(alumno.idAlumno);
                req.onsuccess = resp=>{
                    this.listarAlumnos();
                };
            }
        },
        nuevoAlumno(){
            this.accion = 'nuevo';
            this.alumno.idAlumno = '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.fecha = '';
            this.alumno.direccion = '';
            this.alumno.municipio = '';
            this.alumno.departamento = '';
            this.alumno.telefono = '';
            this.alumno.dui = '';
            this.alumno.sexo = '';
            
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.alumno = alumno;
        },
        listarAlumnos(){
            let store = this.abrirStore('tblalumnos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.alumnos = data.result
                .filter(alumno=>alumno.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                alumno.codigo.indexOf(this.buscar)>-1 ||
                alumno.nombre.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('AlumnosDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblalumno = req.createObjectStore('tblalumnos', {keyPath:'idAlumno'});
                    

                tblalumno.createIndex('idAlumno', 'idAlumno', {unique:true});
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
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
                    <div class="card-header">REGISTRO DE ALUMNOS</div>
                    <div class="card-body">
                        <form id="frmAlumno" @reset.prevent="nuevoAlumno" v-on:submit.prevent="guardarAlumno">

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtCodigoAlumno">Codigo:</label>
                                </div>
                                <div class="col-3 col-md-3">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de alumno de 3 digitos"
                                            v-model="alumno.codigo" type="text" class="form-control" name="txtCodigoAlumno" id="txtCodigoAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNombreAlumno">Nombre:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="alumno.nombre" type="text" class="form-control" name="txtNombreAlumno" id="txtNombreAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtFechaAlumno">Fecha de Nacimiento:</label>
                                </div>
                                <div class="col-9 col-md-5">
                                    <input required 
                                        v-model="alumno.fecha" type="date" class="form-control" name="txtFechaAlumno" id="txtFechaAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtDireccionAlumno">Direccion:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="alumno.direccion" type="text" class="form-control" name="txtDireccionAlumno" id="txtDireccionAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtMunicipioAlumno">Municipio:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="alumno.municipio" type="text" class="form-control" name="txtMunicipioAlumno" id="txtMunicipioAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNDepartamentoAlumno">Departamento:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="alumno.departamento" type="text" class="form-control" name="txtNDepartamentoAlumno" id="txtNDepartamentoAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtTelefonoAlumno">Telefono:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                        v-model="alumno.telefono" type="text" class="form-control" name="txtTelefonoAlumno" id="txtTelefonoAlumno">
                                </div>
                            </div>

                            <div class="row p-1">
                            <div class="col-3 col-md-3">
                                <label for="txtDuiAlumno">Dui:</label>
                            </div>
                            <div class="col-9 col-md-3">
                                <input required pattern="[0-9]{7}-[0-9]{1}"
                                    v-model="alumno.dui" type="text" class="form-control" name="txtDuiAlumno" id="txtDuiAlumno">
                            </div>
                        </div>

                            <div class="row p-1">
                            <div class="col-3 col-md-3">
                                <label for="txtSexoAlumno">Sexo:</label>
                            </div>
                            <div class="col-9 col-md-3">
                                <select                      
                                        v-model="alumno.sexo"  class="form-control" name="txtSexoAlumno" id="txtSexoAlumno">
                                        <option value="Masculino">Hombre</option>
                                        <option value="Femenino">Mujer</option>    
                                    </select> 
                            </div>
                        </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-3">
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
                <div class="card-header">LISTADO DE ALUMNOS</div>
                <div class="card-body">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>BUSCAR:</th>
                                <th colspan="2"><input type="text" class="form-control" v-model="buscar"
                                    @keyup="listarAlumnos()"
                                    placeholder="Buscar por codigo o nombre"></th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>FECHA DE NACIMIENTO</th>
                                <th>DIRECCION</th>
                                <th>MUNICIPIO</th>
                                <th>DEPARTAMENTO</th>
                                <th>TELEFONO</th>
                                <th>DUI</th>
                                <th>SEXO</th>


                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="alumnos in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)" >
                                <td>{{ alumno.codigo }}</td>
                                <td>{{ alumno.nombre }}</td>
                                <td>{{ alumno.fecha }}</td>
                                <td>{{ alumno.direccion }}</td>
                                <td>{{ alumno.municipio }}</td>
                                <td>{{ alumno.departamento }}</td>
                                <td>{{ alumno.telefono }}</td>
                                <td>{{ alumno.dui }}</td>
                                <td>{{ alumno.sexo }}</td>

                                <td><button class="btn btn-danger" @click="eliminarAlumno(alumno)">ELIMINAR</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
`
});


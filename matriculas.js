Vue.component('component-matriculas',{
    
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            matriculas: [],
            matricula:{
            idMatricula : '',
            codigo : '',
            nombres : '',
            apellidos : '',
            direccion : '',
            fechadematri : '',
            correo : '',
            carrera : '',
            municipio : '',
            departamento : '',
            telefono : '',
            dui : '',
            sexo : '',

            }
        }
    },
    methods:{
        guardarMatricula(){
            let store = this.abrirStore('tblmatriculas', 'readwrite');
            if(this.accion==='nuevo'){
                this.matricula.idMatricula = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.matricula) ) );
            this.listar();
            this.nuevoMatricula();
        },
        eliminarMatricula(matricula){
            if( confirm(`Esta seguro de eliminar a ${matricula.nombres}?`) ){
                let store = this.abrirStore('tblmatriculas', 'readwrite'),
                    req = store.delete(matricula.idMatricula);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoMatricula(){
            this.accion = 'nuevo';
            this.matricula.idMatricula = '';
            this.matricula.codigo = '';
            this.matricula.nombres = '';
            this.matricula.apellidos = '';
            this.matricula.direccion = '';
            this.matricula.fechadematri = '';
            this.matricula.correo = '';
            this.matricula.carrera = '';
            this.matricula.municipio = '';
            this.matricula.departamento = '';
            this.matricula.telefono = '';
            this.matricula.dui = '';
            this.matricula.sexo = '';
            
        },
        modificarMatricula(matricula){
            this.accion = 'modificar';
            this.matricula = matricula;
        },
        listar(){
            let store = this.abrirStore('tblmatriculas', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.matriculas = data.result
                .filter(matricula=>matricula.nombres.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                matricula.codigo.indexOf(this.buscar)>-1 ||
                matricula.nombres.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('MatriculasDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblmatricula = req.createObjectStore('tblmatriculas', {keyPath:'idMatricula'});
                    

                tblmatricula.createIndex('idMatricula', 'idMatricula', {unique:true});
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
                this.listar();
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
                                    <label for="txtCodigoMatricula">Codigo:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de la matricula de 3 digitos"
                                            v-model="matricula.codigo" type="text" class="form-control" name="txtCodigoMatricula" id="txtCodigoMatricula">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNombresMatricula">Nombres:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="matricula.nombres" type="text" class="form-control" name="txtNombresMatricula" id="txtNombresMatricula">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtApellidosMatricula">Apellidos:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="matricula.apellidos" type="text" class="form-control" name="txtApellidosMatricula" id="txtApellidosMatricula">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtDireccionMatricula">Direccion:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="matricula.direccion" type="text" class="form-control" name="txtDireccionMatricula" id="txtDireccionMatricula">
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
                                <div class="col-3 col-md-4">
                                    <label for="txtMunicipioMatricula">Municipio:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="matricula.municipio" type="text" class="form-control" name="txtMunicipioMatricula" id="txtMunicipioMatricula">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNDepartamentoMatricula">Departamento:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="matricula.departamento" type="text" class="form-control" name="txtDepartamentoMatricula" id="txtDepartamentoMatricula">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtTelefonoMatricula">Telefono:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                        v-model="matricula.telefono" type="text" class="form-control" name="txtTelefonoMatricula" id="txtTelefonoMatricula">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtDuiMatricula">Dui:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{7}-[0-9]{1}"
                                        v-model="matricula.dui" type="text" class="form-control" name="txtDuiMatricula" id="txtDuiMatricula">
                                </div>
                            </div>

                            <div class="row p-1">
                            <div class="col-3 col-md-4">
                                <label for="txtSexoMatricula">Sexo:</label>
                            </div>
                            <div class="col-6 col-md-6">
                                <select                      
                                        v-model="matricula.sexo"  class="form-control" name="txtSexoMatricula" id="txtSexoMatricula">
                                        <option value="Masculino">Hombre</option>
                                        <option value="Femenino">Mujer</option>    
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
                                    <th>CODIGO</th>
                                    <th>NOMBRES</th>
                                    <th>APELLIDOS</th>
                                    <th>DIRECCION</th>
                                    <th>FECHA DE MATRICULA</th>
                                    <th>CORREO</th>
                                    <th>CARRERA</th>
                                    <th>MUNICIPIO</th>
                                    <th>DEPARTAMENTO</th>
                                    <th>TELEFONO</th>
                                    <th>DUI</th>
                                    <th>SEXO</th>


                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)" >
                                    <td>{{ matricula.codigo }}</td>
                                    <td>{{ matricula.nombres }}</td>
                                    <td>{{ matricula.apellidos }}</td>
                                    <td>{{ matricula.direccion }}</td>
                                    <td>{{ matricula.fechadematri }}</td>
                                    <td>{{ matricula.correo }}</td>
                                    <td>{{ matricula.carrera }}</td>
                                    <td>{{ matricula.municipio }}</td>
                                    <td>{{ matricula.departamento }}</td>
                                    <td>{{ matricula.telefono }}</td>
                                    <td>{{ matricula.dui }}</td>
                                    <td>{{ matricula.sexo }}</td>

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






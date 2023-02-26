Vue.component('component-inscritos',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            inscritos: [],
            inscrito:{
                idInscrito : '',
                codigo : '',
                nombre : '',
                fecha : '',
                direccion : '',
                municipio : '',
                departamento : '',
                telefono : '',
                dui : '',
                sexo : '',
            }
        }
    },
    methods:{
        guardarInscrito(){
            let store = this.abrirStore('tblinscritos', 'readwrite');
            if(this.accion==='nuevo'){
                this.inscrito.idInscrito = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.inscrito) ) );
            this.listar();
            this.nuevoInscrito();
        },
        eliminarInscrito(inscrito){
            if( confirm(`Esta seguro de eliminar a ${inscrito.nombre}?`) ){
                let store = this.abrirStore('tblinscritos', 'readwrite'),
                    req = store.delete(inscrito.idInscrito);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoInscrito(){
            this.accion = 'nuevo';
            this.inscrito.idInscrito = '';
            this.inscrito.codigo = '';
            this.inscrito.nombre = '';
            this.inscrito.fecha = '';
            this.inscrito.direccion = '';
            this.inscrito.municipio = '';
            this.inscrito.departamento = '';
            this.inscrito.telefono = '';
            this.inscrito.dui = '';
            this.inscrito.sexo = '';
            
        },
        modificarInscrito(inscrito){
            this.accion = 'modificar';
            this.inscrito = inscrito;
        },
        listar(){
            let store = this.abrirStore('tblinscritos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.inscritos = data.result
                .filter(inscrito=>inscrito.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                inscrito.codigo.indexOf(this.buscar)>-1 ||
                inscrito.nombre.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('InscritosDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblinscrito = req.createObjectStore('tblinscritos', {keyPath:'idInscrito'});
                    

                tblinscrito.createIndex('idInscrito', 'idInscrito', {unique:true});
                
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
                    <div class="card-header">REGISTRO DE INSCRITOS</div>
                    <div class="card-body">
                        <form id="frmInscrito" @reset.prevent="nuevoInscrito" v-on:submit.prevent="guardarInscrito">

                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtCodigoInscrito">Codigo:</label>
                                </div>
                                <div class="col-3 col-md-3">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de inscrito de 3 digitos"
                                            v-model="inscrito.codigo" type="text" class="form-control" name="txtCodigoInscrito" id="txtCodigoInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNombreInscrito">Nombre:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscrito.nombre" type="text" class="form-control" name="txtNombreInscrito" id="txtNombreInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtFechaInscrito">Fecha de Nacimiento:</label>
                                </div>
                                <div class="col-9 col-md-5">
                                    <input required 
                                        v-model="inscrito.fecha" type="date" class="form-control" name="txtFechaInscrito" id="txtFechaInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtDireccionInscrito">Direccion:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscrito.direccion" type="text" class="form-control" name="txtDireccionInscrito" id="txtDireccionInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtMunicipioInscrito">Municipio:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscrito.municipio" type="text" class="form-control" name="txtMunicipioInscrito" id="txtMunicipioInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNDepartamentoInscrito">Departamento:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscrito.departamento" type="text" class="form-control" name="txtNDepartamentoInscrito" id="txtNDepartamentoInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtTelefonoInscrito">Telefono:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                        v-model="inscrito.telefono" type="text" class="form-control" name="txtTelefonoInscrito" id="txtTelefonoInscrito">
                                </div>
                            </div>


                            <div class="row p-1">
                            <div class="col-3 col-md-3">
                                <label for="txtDuiInscrito">Dui:</label>
                            </div>
                            <div class="col-9 col-md-3">
                                <input required pattern="[0-9]{7}-[0-9]{1}"
                                    v-model="inscrito.dui" type="text" class="form-control" name="txtDuiInscrito" id="txtDuiInscrito">
                            </div>
                        </div>


                            <div class="row p-1">
                            <div class="col-3 col-md-3">
                                <label for="txtSexoInscrito">Sexo:</label>
                            </div>
                            <div class="col-9 col-md-3">
                                <select                      
                                        v-model="inscrito.sexo"  class="form-control" name="txtSexoInscrito" id="txtSexoInscrito">
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
                    <div class="card-header">LISTADO DE INSCRITOS</div>
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
                                <tr v-for="inscrito in inscritos" :key="inscrito.idInscrito" @click="modificarInscrito(inscrito)" >
                                    <td>{{ inscrito.codigo }}</td>
                                    <td>{{ inscrito.nombre }}</td>
                                    <td>{{ inscrito.fecha }}</td>
                                    <td>{{ inscrito.direccion }}</td>
                                    <td>{{ inscrito.municipio }}</td>
                                    <td>{{ inscrito.departamento }}</td>
                                    <td>{{ inscrito.telefono }}</td>
                                    <td>{{ inscrito.dui }}</td>
                                    <td>{{ inscrito.sexo }}</td>

                                    <td><button class="btn btn-danger" @click="eliminarInscrito(inscrito)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});
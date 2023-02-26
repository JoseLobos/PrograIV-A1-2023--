Vue.component('component-docentes',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            docentes: [],
            docente:{
                idDocente   : '',
                codigo      : '',
                nombre      : '',
                fecha       : '',
                direccion   : '',
                municipio   : '',
                departamento: '',
                telefono    : '',
                dui         : '',
                sexo        : '',
            }
        }
    },
    methods:{
        guardarDocente(){
            let store = this.abrirStore('tbldocentes', 'readwrite');
            if(this.accion==='nuevo'){
                this.docente.idDocente = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.docente) ) );
            this.listar();
            this.nuevoDocente();
        },
        eliminarDocente(docente){
            if( confirm(`Esta seguro de eliminar a ${docente.nombre}?`) ){
                let store = this.abrirStore('tbldocentes', 'readwrite'),
                    req = store.delete(docente.idDocente);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoDocente(){
            this.accion = 'nuevo';
            this.docente.idDocente = '';
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.fecha = '';
            this.docente.municipio = '';
            this.docente.direccion = '';
            this.docente.departamento = '';
            this.docente.telefono = '';
            this.docente.dui = '';
            this.docente.sexo = '';
            
        },
        modificarDocente(docente){
            this.accion = 'modificar';
            this.docente = docente;
        },
        listar(){
            let store = this.abrirStore('tbldocentes', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.docentes = data.result
                .filter(docente=>docente.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                docente.codigo.indexOf(this.buscar)>-1 ||
                docente.nombre.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('DocentesDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tbldocente = req.createObjectStore('tbldocentes', {keyPath:'idDocente'});
                    

                tbldocente.createIndex('idDocente', 'idDocente', {unique:true});
                
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
                    <div class="card-header">REGISTRO DE DOCENTE</div>
                    <div class="card-body">
                        <form id="frmDocente" @reset.prevent="nuevoDocente" v-on:submit.prevent="guardarDocente">

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtCodigoDocente">CODIGO:</label>
                                </div>
                                <div class="col-3 col-md-2">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de docente de 3 digitos"
                                            v-model="docente.codigo" type="text" class="form-control" name="txtCodigoDocente" id="txtCodigoDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtNombreDocente">NOMBRE:</label>
                                </div>
                                <div class="col-9 col-md-4">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="docente.nombre" type="text" class="form-control" name="txtNombreDocente" id="txtNombreDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtFechaDocente">FECHA DE NACIMIENTO:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input required 
                                        v-model="docente.fecha" type="date" class="form-control" name="txtFechaDocente" id="txtFechaDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtDireccionDocente">DIRECCION:</label>
                                </div>
                                <div class="col-9 col-md-4">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="docente.direccion" type="text" class="form-control" name="txtDireccionDocente" id="txtDireccionDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtMunicipioDocente">MUNICIPIO:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="docente.municipio" type="text" class="form-control" name="txtMunicipioDocente" id="txtMunicipioDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtNDepartamentoDocente">DEPARTAMENTO:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="docente.departamento" type="text" class="form-control" name="txtNDepartamentoDocente" id="txtNDepartamentoDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtTelefonoDocente">TELEFONO:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                        v-model="docente.telefono" type="text" class="form-control" name="txtTelefonoDocente" id="txtTelefonoDocente">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <label for="txtDuiDocente">DUI:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input required pattern="[0-9]{7}-[0-9]{1}"
                                        v-model="docente.dui" type="text" class="form-control" name="txtDuiDocente" id="txtDuiDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                            <div class="col-3 col-md-3">
                                <label for="txtSexoDocente">SEXO:</label>
                            </div>
                            <div class="col-9 col-md-3">
                                <select                      
                                        v-model="docente.sexo"  class="form-control" name="txtSexoDocente" id="txtSexoDocente">
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
                    <div class="card-header">LISTADO DE DOCENTES</div>
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
                                <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)" >
                                    <td>{{ docente.codigo }}</td>
                                    <td>{{ docente.nombre }}</td>
                                    <td>{{ docente.fecha }}</td>
                                    <td>{{ docente.direccion }}</td>
                                    <td>{{ docente.municipio }}</td>
                                    <td>{{ docente.departamento }}</td>
                                    <td>{{ docente.telefono }}</td>
                                    <td>{{ docente.dui }}</td>
                                    <td>{{ docente.sexo }}</td>

                                    <td><button class="btn btn-danger" @click="eliminarDocente(docente)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});


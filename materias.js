Vue.component('component-materias',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            materias: [],
            materia:{
                idMateria : '',
                codigo : '',
                materia : '',
                docente : '',
                horario : '',
                ciclo : '',
                
            }
        }
    },
    methods:{
        guardarMateria(){
            
            let store = this.abrirStore('tblmaterias', 'readwrite');
            if(this.accion==='nuevo'){
                this.materia.idMateria = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.materia) ) );
            this.listar();
            this.nuevoMateria();
        },
        eliminarMateria(materia){
            if( confirm(`Esta seguro de eliminar a ${materia.materia}?`) ){
                let store = this.abrirStore('tblmaterias', 'readwrite'),
                    req = store.delete(materia.idMateria);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoMateria(){
            this.accion = 'nuevo';
            this.materia.idMateria = '';
            this.materia.codigo = '';
            this.materia.materia = '';
            this.materia.docente = '';
            this.materia.horario = '';
            this.materia.ciclo = '';
            
            
        },
        modificarMateria(materia){
            this.accion = 'modificar';
            this.materia = materia;
        },
        listar(){
            let store = this.abrirStore('tblmaterias', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.materias = data.result
                .filter(materia=>materia.materia.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                materia.codigo.indexOf(this.buscar)>-1 ||
                materia.materia.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('MateriasDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblmateria = req.createObjectStore('tblmaterias', {keyPath:'idMateria'});
                    

                tblmateria.createIndex('idMateria', 'idMateria', {unique:true});
                
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
                    <div class="card-header">REGISTRO DE MATERIA</div>
                    <div class="card-body">
                        <form id="frmMateria" @reset.prevent="nuevoMateria" v-on:submit.prevent="guardarMateria">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtCodigoMateria">Codigo:</label>
                                </div>
                                <div class="col-3 col-md-3">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de materia de 3 digitos"
                                            v-model="materia.codigo" type="text" class="form-control" name="txtCodigoMateria" id="txtCodigoMateria">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtMateriaMateria">Materia:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="materia.materia" type="text" class="form-control" name="txtMateriaMateria" id="txtMateriaMateria">
                                </div>
                            </div>
                            <div class="row p-1">
                            <div class="col-3 col-md-2">
                                <label for="txtDocenteMateria">Docente:</label>
                            </div>
                            <div class="col-9 col-md-6">
                                <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                    v-model="materia.docente" type="text" class="form-control" name="txtDocenteMateria" id="txtDocenteMateria">
                            </div>
                        </div>

                        <div class="row p-1">
                        <div class="col-3 col-md-2">
                          <label for="ciclo">Ciclo:</label>
                        </div>
                        <div class="col-9 col-md-6">
                          <select v-model="materia.ciclo" name="txtCicloMateria" id="txtCicloMateria">
                            <option value="" disabled>Selecciona tu ciclo</option>
                            <option value="ciclo 1">ciclo 1</option>
                            <option value="ciclo 2">ciclo 2</option>
                            <option value="ciclo 3">ciclo 3</option>
                            <option value="ciclo 4">ciclo 4</option>
                            <option value="ciclo 5">ciclo 5</option>
                            <option value="ciclo 6">ciclo 6</option>
                            <option value="ciclo 7">ciclo 7</option>
                            <option value="ciclo 8">ciclo 8</option>
                            <option value="ciclo 9">ciclo 9</option>
                            <option value="ciclo 10">ciclo 10</option>
                          </select>
                        </div>
                      </div>

                            <div class="row p-1">
  <div class="col-3 col-md-2">
    <label for="horario">Horario:</label>
  </div>
  <div class="col-9 col-md-6">
    <select v-model="materia.horario" name="txtHorarioMateria" id="txtHorarioMateria">
      <option value="" disabled>Selecciona un horario</option>
      <option value="7:00am - 8:50am">7:00am - 8:50am</option>
      <option value="9:00am - 10:50am">9:00am - 10:50am</option>
      <option value="11:00am - 12:50pm">11:00am - 12:50pm</option>
      <option value="1:00pm - 2:50pm">1:00pm - 2:50pm</option>
      <option value="3:00pm - 4:50pm">3:00pm - 4:50pm</option>
      <option value="5:00pm - 6:50pm">5:00pm - 6:50pm</option>
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
                    <div class="card-header">LISTADO DE MATERIAS</div>
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
                                <th>codigo:</th>
                                <th>materias:</th>
                                <th>docente:</th>
                                <th>horario:</th>
                                <th>ciclo:</th>
                



                                </tr>
                            </thead>
                            <tbody>

                                <tr v-for="materia in materias" :key="materia.idMateria" @click="modificarMateria(materia)" >
                                    <td>{{ materia.codigo  }}</td>
                                    <td>{{ materia.materia }}</td>
                                    <td>{{ materia.docente }}</td>
                                    <td>{{ materia.horario }}</td>
                                    <td>{{ materia.ciclo   }}</td>
                                    
                                    <td><button class="btn btn-danger" @click="eliminarMateria(materia)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});
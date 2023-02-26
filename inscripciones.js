Vue.component('component-inscripcions',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            inscripcions: [],
            inscripcion:{
                idInscripcion : '',
                codigo : '',
                inscripcion : '',
                docente : '',
                horario : '',
                ciclo : '',
                
            }
        }
    },
    methods:{
        guardarInscripcion(){
            
            let store = this.abrirStore('tblinscripcions', 'readwrite');
            if(this.accion==='nuevo'){
                this.inscripcion.idInscripcion = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.inscripcion) ) );
            this.listarInscripcions();
            this.nuevoInscripcion();
        },
        eliminarInscripcion(inscripcion){
            if( confirm(`Esta seguro de eliminar a ${inscripcion.inscripcion}?`) ){
                let store = this.abrirStore('tblinscripcions', 'readwrite'),
                    req = store.delete(inscripcion.idInscripcion);
                req.onsuccess = resp=>{
                    this.listarInscripcions();
                };
            }
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion.idInscripcion = '';
            this.inscripcion.codigo = '';
            this.inscripcion.inscripcion = '';
            this.inscripcion.docente = '';
            this.inscripcion.horario = '';
            this.inscripcion.ciclo = '';
            
            
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        listarInscripcions(){
            let store = this.abrirStore('tblinscripcions', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.inscripcions = data.result
                .filter(inscripcion=>inscripcion.inscripcion.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                inscripcion.codigo.indexOf(this.buscar)>-1 ||
                inscripcion.inscripcion.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('InscripcionsDB',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblinscripcion = req.createObjectStore('tblinscripcions', {keyPath:'idInscripcion'});
                    

                tblinscripcion.createIndex('idInscripcion', 'idInscripcion', {unique:true});
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
                this.listarInscripcions();
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
                        <form id="frmInscripcion" @reset.prevent="nuevoInscripcion" v-on:submit.prevent="guardarInscripcion">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtCodigoInscripcion">Codigo:</label>
                                </div>
                                <div class="col-3 col-md-3">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de inscripcion de 3 digitos"
                                            v-model="inscripcion.codigo" type="text" class="form-control" name="txtCodigoInscripcion" id="txtCodigoInscripcion">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtInscripcionInscripcion">Inscripcion:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscripcion.inscripcion" type="text" class="form-control" name="txtInscripcionInscripcion" id="txtInscripcionInscripcion">
                                </div>
                            </div>
                            <div class="row p-1">
                            <div class="col-3 col-md-2">
                                <label for="txtDocenteInscripcion">Docente:</label>
                            </div>
                            <div class="col-9 col-md-6">
                                <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                    v-model="inscripcion.docente" type="text" class="form-control" name="txtDocenteInscripcion" id="txtDocenteInscripcion">
                            </div>
                        </div>

                        <div class="row p-1">
                        <div class="col-3 col-md-2">
                          <label for="ciclo">Ciclo:</label>
                        </div>
                        <div class="col-9 col-md-6">
                          <select v-model="inscripcion.ciclo" name="txtCicloInscripcion" id="txtCicloInscripcion">
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
    <select v-model="inscripcion.horario" name="txtHorarioInscripcion" id="txtHorarioInscripcion">
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
                                        @keyup="listarInscripcions()"
                                        placeholder="Buscar por codigo o nombre"></th>
                                </tr>
                                <tr>
                                <th>codigo:</th>
                                <th>inscripcions:</th>
                                <th>docente:</th>
                                <th>horario:</th>
                                <th>ciclo:</th>
                



                                </tr>
                            </thead>
                            <tbody>

                                <tr v-for="inscripcion in inscripcions" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" >
                                    <td>{{ inscripcion.codigo  }}</td>
                                    <td>{{ inscripcion.inscripcion }}</td>
                                    <td>{{ inscripcion.docente }}</td>
                                    <td>{{ inscripcion.horario }}</td>
                                    <td>{{ inscripcion.ciclo   }}</td>
                                    
                                    <td><button class="btn btn-danger" @click="eliminarInscripcion(inscripcion)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});
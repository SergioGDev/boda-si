import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvitadoSchema, NOMBRE_ASC, NOMBRE_DESC, MESA_ASC, MESA_DESC, 
  MesaSchema, NUMERO_ASC, NUMERO_DESC, HeroeSchema } from '../../../interfaces/datos.interfaces';
import { InvitadosService } from '../../../services/invitados.service';
import { MesasService } from '../../../services/mesas.service';
import { switchMap } from 'rxjs/operators';
import { HeroesService } from '../../../services/heroes.service';

@Component({
  selector: 'app-gestion-invitados',
  templateUrl: './gestion-invitados.component.html',
  styleUrls: ['./gestion-invitados.component.css']
})
export class GestionInvitadosComponent implements OnInit {

  constructor(
    private invitadosService: InvitadosService,
    private mesasService: MesasService,
    private heroesService: HeroesService,
    private fb: FormBuilder,
    private snackBarService: MatSnackBar
  ) { }

  vInvitados: InvitadoSchema[] = [];
  vInvitadosVisible: InvitadoSchema[] = [];
  vMesas: MesaSchema[] = [];
  vHeroes: HeroeSchema[] = [];

  page: number = 0;
  maxPaginas: number = 0;
  pageSize: number = 10;
  ordenTablaInvitados: string = MESA_ASC;
  ordenTablaMesas: string = NOMBRE_ASC;

  cargandoInvitados: boolean = false;

  dialogEditarInvitadoAbierto: boolean = false;
  creandoNuevoInvitado: boolean = false;
  creandoNuevaMesa: boolean = false;
  invitadoSeleccionado?: InvitadoSchema;
  indexInvitadoEditando?: number;

  formEditarInvitado: FormGroup = this.fb.group({
    nombre: [, [Validators.required]],
    mesaSelect: [, []]
  })

  formEditarMesa: FormGroup = this.fb.group({
    nombre: [, [Validators.required]],
    heroe: [, [Validators.required]]
  })

  dialogEliminarInvitadoAbierto: boolean = false;
  dialogEliminarTodosLosInvitadosAbierto: boolean = false;

  dialogEditarMesaAbierto: boolean = false;
  mesaSeleccionada?: MesaSchema;

  ngOnInit(): void {
    this.cargandoInvitados = true;

    this.invitadosService.obtenerListadoInvitados().pipe(
      switchMap( resp => {
        this.vInvitados = resp.data;
        return this.mesasService.obtenerListadoMesas();
      }),
      switchMap( resp => {
        console.log(resp)
        this.vMesas = resp.data;
        return this.heroesService.obtenerListadoHeroes();
      })
    ).subscribe( resp => {
      this.vHeroes = resp.data;

      this.vMesas.forEach( mesa => {
        const heroe = this.vHeroes.find( heroe => heroe._id === mesa.heroe );
        mesa.heroeSchema = heroe;
      })

      this.vInvitados.forEach( invitado => {
        const mesa = this.vMesas.find( mesa => mesa._id === invitado.mesa );
        invitado.mesaSchema = mesa;
      })

      this.page = 0;
      this.maxPaginas = Math.floor(this.vInvitados.length / this.pageSize);

      this.asignarVInvitados();
      this.cargandoInvitados = false;
    }, error => {
      console.log(error);
      this.cargandoInvitados = false;
    })

  }

  ordenar(tipoOrden: string) {
    if (tipoOrden === 'nombre') {
      if (this.ordenTablaInvitados === NOMBRE_ASC) {
        this.ordenTablaInvitados = NOMBRE_DESC;
      } else {
        this.ordenTablaInvitados = NOMBRE_ASC;
      }
    } else if (tipoOrden === 'mesa') {
      if (this.ordenTablaInvitados === MESA_ASC) {
        this.ordenTablaInvitados = MESA_DESC;
      } else {
        this.ordenTablaInvitados = MESA_ASC;
      }
    }

    switch (this.ordenTablaInvitados) {
      case NOMBRE_ASC:
        this.vInvitados = this.vInvitados.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        break;

      case NOMBRE_DESC:
        this.vInvitados = this.vInvitados.sort((a, b) => a.nombre < b.nombre ? 1 : -1);
        break;

      case MESA_ASC:
        this.vInvitados = this.vInvitados.sort((a, b) => a.mesaSchema?.nombre! < b.mesaSchema?.nombre! ? -1 : 1);
        break;

      case MESA_DESC:
        this.vInvitados = this.vInvitados.sort((a, b) => a.mesaSchema?.nombre! < b.mesaSchema?.nombre! ? 1 : -1);
        break;
    }

    this.asignarVInvitados();
  }

  ordenarTablaMesas(tipoOrden: string) {
    if (tipoOrden === 'nombre') {
      if (this.ordenTablaMesas === NOMBRE_ASC) {
        this.ordenTablaMesas = NOMBRE_DESC;
      } else {
        this.ordenTablaMesas = NOMBRE_ASC;
      }
    } else if (tipoOrden === 'numero') {
      if (this.ordenTablaMesas === NUMERO_ASC) {
        this.ordenTablaMesas = NUMERO_DESC;
      } else {
        this.ordenTablaMesas = NUMERO_ASC;
      }
    }


    switch (this.ordenTablaMesas) {
      case NOMBRE_ASC:
        this.vMesas = this.vMesas.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        break;

      case NOMBRE_DESC:
        this.vMesas = this.vMesas.sort((a, b) => a.nombre < b.nombre ? 1 : -1);
        break;

      case NUMERO_ASC:
        this.vMesas = this.vMesas.sort((a, b) => a.numeroInvitados! < b.numeroInvitados! ? -1 : 1);
        break;

      case NUMERO_DESC:
        this.vMesas = this.vMesas.sort((a, b) => a.numeroInvitados! < b.numeroInvitados! ? 1 : -1);
        break;
    }
  }

  asignarVInvitados(v?: InvitadoSchema[]) {
    
    if (v) {
      this.vInvitados = this.vInvitados.concat(v);
      this.page = 0;
      this.maxPaginas = Math.floor(this.vInvitados.length / this.pageSize);
    }
    this.asignarVMesas();

    const inicio = (this.page * this.pageSize);
    const fin = inicio + this.pageSize;
    this.vInvitadosVisible = this.vInvitados.slice(inicio, fin);

  }

  asignarVMesas() {
    let vAux: any = {};
    this.vInvitados.forEach(invitado => {
      vAux[invitado.categoria!] ? vAux[invitado.categoria!]++ : vAux[invitado.categoria!] = 1;
    })

    Object.keys(vAux).forEach(key => {
      this.vMesas.find(mesa => mesa.nombre === key)!.numeroInvitados = vAux[key];
    })
  }

  cargarDatosCsv(vInvitadosCsv: InvitadoSchema[]) {
    this.cargandoInvitados = true;
    let vMesasNuevas: MesaSchema[] = [];

    let vAux: any = {};
    vInvitadosCsv.forEach(invitado => {
      vAux[invitado.categoria!] ? vAux[invitado.categoria!]++ : vAux[invitado.categoria!] = 1;
    })

    Object.keys(vAux).forEach(key => {
      vMesasNuevas.push({
        nombre: key
      })
    })

    this.mesasService.guardarMesas(vMesasNuevas).pipe(
      switchMap( resp => {
        this.vMesas = this.vMesas.concat(resp.data);

        vInvitadosCsv.forEach( invitado => {
          invitado.mesa = this.vMesas.find( mesa => mesa.nombre === invitado.categoria )?._id
        });

        return this.invitadosService.guardarInvitados(vInvitadosCsv);
      })
    ).subscribe( resp => {
      this.vInvitados = this.vInvitados.concat(resp.data);
      this.vInvitados.forEach( invitado => invitado.mesaSchema = this.vMesas.find( mesa => mesa._id === invitado.mesa ) )
      this.asignarVInvitados();
      this.cargandoInvitados = false;
    })

  }

  paginaSiguiente() {
    this.page = (this.page === this.maxPaginas) ? this.page : this.page + 1;
    this.asignarVInvitados();
  }

  paginaAnterior() {
    this.page = (this.page === 0) ? 0 : this.page - 1;
    this.asignarVInvitados();
  }

  abrirDialogNuevoInvitado() {
    this.invitadoSeleccionado = undefined;
    this.dialogEditarInvitadoAbierto = true;

    this.formEditarInvitado.reset({
      nombre: '',
      mesaSelect: '',
      mesaNueva: '',
      checkMesaNueva: false
    })
  }

  editarInvitado(invitado: InvitadoSchema, index: number) {
    this.indexInvitadoEditando = index;
    this.invitadoSeleccionado = invitado;
    this.dialogEditarInvitadoAbierto = true;

    this.formEditarInvitado.reset({
      nombre: this.invitadoSeleccionado.nombre,
      mesaSelect: this.invitadoSeleccionado.mesaSchema
    })
  }

  abrirDialogNuevaMesa() {
    this.mesaSeleccionada = undefined;
    this.dialogEditarMesaAbierto = true;
    this.creandoNuevaMesa = true;

    this.formEditarMesa.reset({
      nombre: '',
      heroe: undefined
    })
  }

  abrirDialogEliminarInvitado(invitado: InvitadoSchema, index: number) {
    this.dialogEliminarInvitadoAbierto = true;
    this.invitadoSeleccionado = invitado;
  }

  abrirDialogEditarMesa(mesa: MesaSchema) {
    this.mesaSeleccionada = mesa;
    this.dialogEditarMesaAbierto = true;
    this.creandoNuevaMesa = false;

    this.formEditarMesa.reset({
      nombre: mesa.nombre,
      heroe: mesa.heroeSchema
    })
  }

  submitGuardarNuevoInvitado() {
    const check = this.formEditarInvitado.value['checkMesaNueva'];

    if (check && this.formEditarInvitado.value['mesaNueva'].trim() === '') {
      this.formEditarInvitado.get('mesaNueva')!.setErrors({ 'mesa-requerida': true });
      this.formEditarInvitado.markAllAsTouched();
      return;
    }

    this.formEditarInvitado.get('mesaNueva')!.setErrors({ 'mesa-requerida': true });

    const invitado: InvitadoSchema = {
      nombre: this.formEditarInvitado.value['nombre'],
      categoria: check ? this.formEditarInvitado.value['mesaNueva'] : this.formEditarInvitado.value['mesaSelect'],
    }

    this.invitadosService.guardarInvitado(invitado).subscribe(
      (resp) => {
        this.vInvitados.push(resp.data);
        this.asignarVInvitados();

        this.formEditarInvitado.reset({});
        this.invitadoSeleccionado = undefined;
        this.dialogEditarInvitadoAbierto = false;
        this.snackBarService.open('Invitado guardado correctamente', 'Aceptar');
      }
    )
  }

  submitEditarInvitado() {

    var invitado: InvitadoSchema = {
      _id: this.invitadoSeleccionado!._id!,
      nombre: this.formEditarInvitado.value['nombre'],
      mesa: this.formEditarInvitado.value['mesaSelect'],
    }

    this.invitadosService.actualizarInvitado(invitado, this.invitadoSeleccionado!._id!).subscribe(
      resp => {
        const inv = this.vInvitados.find(invitado => invitado._id === this.invitadoSeleccionado!._id!);
        const indexOf = this.vInvitados.indexOf(inv!);
        invitado.mesaSchema = inv!.mesaSchema;
        invitado.categoria = inv!.categoria;

        this.vInvitados[indexOf] = invitado;
        this.asignarVInvitados();

        this.formEditarInvitado.reset({});
        this.invitadoSeleccionado = undefined;
        this.dialogEditarInvitadoAbierto = false;
        this.snackBarService.open('Invitado editado correctamente', 'Aceptar');
      }
    )

  }

  submitEliminarInvitado() {
    this.invitadosService.eliminarInvitado(this.invitadoSeleccionado!._id!).subscribe( 
      resp => {
        this.dialogEliminarInvitadoAbierto = false;
        this.vInvitados.splice(this.vInvitados.indexOf(this.invitadoSeleccionado!), 1);
        this.asignarVInvitados();
        this.snackBarService.open('Invitado eliminado correctamente', 'Aceptar');
      })
  }

  submitEliminarListadoInvitados() {
    this.invitadosService.eliminarTodosLosInvitados().subscribe(
      resp => {
        this.vInvitados.splice(0);
        this.asignarVInvitados();
        this.dialogEliminarTodosLosInvitadosAbierto = false;
        this.snackBarService.open('Se han eliminado todos los invitados.', 'Aceptar');
      }
    )
  }

  submitCrearNuevaMesa() {
    if (this.formEditarMesa.invalid) {
      this.formEditarMesa.markAllAsTouched();
      return;
    }

    const mesa: MesaSchema = {
      nombre: this.formEditarMesa.value['nombre'],
      heroe: this.formEditarMesa.value['heroe']._id
    }

    this.mesasService.guardarMesa(mesa).subscribe(resp => {
      const nuevaMesa: MesaSchema = resp.data;
      this.vMesas.push(nuevaMesa);

      this.asignarVInvitados();
      this.snackBarService.open('Se ha guardado la nueva mesa correctamente.', 'Aceptar')

      this.dialogEditarMesaAbierto = false;
      this.creandoNuevaMesa = false;
    }, err => {
      console.log(err);
      this.snackBarService.open('Ha ocurrido un error al guardar los datos.', 'Aceptar')

      this.dialogEditarMesaAbierto = false;
      this.creandoNuevaMesa = false;
    })
  }

  submitEditarMesa() {
    if (this.formEditarMesa.invalid) {
      this.formEditarMesa.markAllAsTouched();
      return;
    }

    const mesa: MesaSchema = {
      _id: this.mesaSeleccionada!._id,
      nombre: this.formEditarMesa.value['nombre'],
      heroe: this.formEditarMesa.value['heroe']
    }

    this.mesasService.modificarMesa(mesa).subscribe(resp => {

      this.vMesas.forEach(mesa => {
        if (mesa._id === this.mesaSeleccionada?._id) {
          mesa.heroe = this.formEditarMesa.value['heroe'].nombre,
            mesa.heroeSchema = this.formEditarMesa.value['heroe']
        }
      })

      this.vInvitados.map(invitado => {
        if (invitado.mesaSchema!._id === this.mesaSeleccionada!._id) {
          invitado.mesa = resp.data._id;
          invitado.mesaSchema = resp.data;
        }
      })
      this.asignarVInvitados();
      this.dialogEditarMesaAbierto = false;
      this.mesaSeleccionada = undefined;
      this.formEditarMesa.reset({});
      this.snackBarService.open('Se han modificadolos datos de la mesa.', 'Aceptar');
    },
      err => {
        this.dialogEditarMesaAbierto = false;
        this.snackBarService.open('Ha ocurrido un error al cambiar los datos de la mesa.', 'Aceptar');
        console.log(err);
      })
  }

  cerrarDialogEditarMesa() {
    this.mesaSeleccionada = undefined;
    this.formEditarMesa.reset();
    this.dialogEditarMesaAbierto = false;
  }

  cerrarDialogEditar() {
    this.creandoNuevoInvitado = false;
    this.dialogEditarInvitadoAbierto = false;
    this.invitadoSeleccionado = undefined;
  }

}

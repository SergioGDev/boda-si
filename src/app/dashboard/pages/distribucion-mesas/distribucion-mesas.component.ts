import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { HeroesService } from '../../../services/heroes.service';
import { InvitadosService } from '../../../services/invitados.service';
import { InvitadoSchema, HeroeSchema, MesaSchema } from '../../../interfaces/datos.interfaces';
import { SopaLetrasComponent } from './sopa-letras/sopa-letras.component';

import { MesasService } from '../../../services/mesas.service';
import { SopaLetrasService } from '../../../services/sopa-letras.service';

@Component({
  selector: 'app-distribucion-mesas',
  templateUrl: './distribucion-mesas.component.html',
  styleUrls: ['./distribucion-mesas.component.css', './card.component.css']
})
export class DistribucionMesasComponent implements OnInit {

  vInvitados: InvitadoSchema[] = [];
  vMesas: MesaSchema[] = [];
  vHeroes: HeroeSchema[] = [];

  mostrandoListado: boolean = false;
  vInvitadosMostrados: InvitadoSchema[] = [];
  vNombres: string[] = [];
  heroeSr?: string;

  cargandoDatos: boolean = false;

  mostrandoSopaLetras: boolean = false;

  anchoPantalla: number = 0;

  @ViewChild('sopaDeLetras') sopaLetras!: SopaLetrasComponent;

  constructor(
    private heroesService: HeroesService,
    private mesasService: MesasService,
    private invitadosService: InvitadosService,
    private sopaLetrasService: SopaLetrasService
  ) { }

  ngOnInit(): void { 
    this.anchoPantalla = window.innerWidth;
    this.cargandoDatos = true;

    this.heroesService.obtenerListadoHeroes().pipe(
      switchMap( ({ data }) => {
        this.vHeroes = data;
        return this.invitadosService.obtenerListadoInvitados();
      }),
      switchMap( ({ data }) => {
        this.vInvitados = data;
        return this.mesasService.obtenerListadoMesas();
      })
    ).subscribe(
      ({ data }) => {
        this.vMesas = data;

        this.vMesas.forEach( mesa => {
          mesa.heroeSchema = this.vHeroes.find( heroe => heroe._id === mesa.heroe )
          mesa.vInvitados = [];
        })

        this.vInvitados.forEach( invitado => {
          invitado.mesaSchema = this.vMesas.find( mesa => mesa._id === invitado.mesa )
          this.vMesas.find( mesa => mesa._id === invitado.mesa )?.vInvitados?.push(invitado.nombre);
        })

        console.log(this.vMesas)
        this.cargandoDatos = false;
      }
    )
  }

  abrirListadoInvitados(mesa: MesaSchema) {
    const heroe: HeroeSchema = mesa.heroeSchema!;
    this.vInvitadosMostrados = [];
    
    this.vInvitados.forEach( invitado => {
      if (invitado.mesaSchema!.heroe === heroe._id){
        this.vInvitadosMostrados.push(invitado);
      }
    })

    this.vMesas.map( mesa => mesa.mostrando = false);
    mesa.mostrando = true;
    this.mostrandoListado = true;
  }

  cerrarListadoInvitados() {
    this.mostrandoListado = false;
    this.vMesas.map( mesa => mesa.mostrando = false);
  }
  mostrarSopaLetras(heroeSchema: HeroeSchema) {
    this.vInvitadosMostrados = [];
    
    this.vInvitados.forEach( invitado => {
      if (invitado.mesaSchema!.heroe === heroeSchema._id){
        this.vInvitadosMostrados.push(invitado);
        this.vNombres.push(invitado.nombre.replace(' ', ''));
      }
    })

    this.heroeSr = heroeSchema.nombre;
    this.heroeSr = this.heroeSr.replace(' ', '');

    this.mostrandoSopaLetras = true;
    // this.sopaLetras.generarMapa(this.heroeSr, this.vNombres);

  }

  cerrarSopaDeLetras() {
    this.vInvitadosMostrados = [];
    this.sopaLetrasService.inicializarMapa();
    this.heroeSr = '';
    this.mostrandoSopaLetras = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): any {
    this.anchoPantalla = event.target.innerWidth;
  } 


}

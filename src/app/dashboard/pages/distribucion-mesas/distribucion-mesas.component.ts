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

  vMesasMostradas: MesaSchema[] = [];

  mostrandoListado: boolean = false;
  vInvitadosMostrados: InvitadoSchema[] = [];
  vNombres: string[] = [];
  heroeSr?: string;

  cargandoDatos: boolean = false;

  mostrandoSopaLetras: boolean = false;

  anchoPantalla: number = 0;
  acentos = [
      { conTilde: 'á', sinTilde: 'a' },
      { conTilde: 'é', sinTilde: 'e' },
      { conTilde: 'í', sinTilde: 'i' },
      { conTilde: 'ó', sinTilde: 'o' },
      { conTilde: 'ú', sinTilde: 'u' },
      { conTilde: 'Á', sinTilde: 'A' },
      { conTilde: 'É', sinTilde: 'E' },
      { conTilde: 'Í', sinTilde: 'I' },
      { conTilde: 'Ó', sinTilde: 'O' },
      { conTilde: 'Ú', sinTilde: 'U' },
  ]
	

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

        this.vMesasMostradas = this.vMesas;
        console.log(this.vMesas);

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

  aplicarBusqueda(busqueda: string) {
    
    this.vMesasMostradas = this.vMesas.filter( mesa => {
      const vAux = mesa.vInvitados!.map( invitado => invitado.toLowerCase());
      return vAux.some( invitado => this.cumpleCriteriosBusqueda(invitado, busqueda));
    });
  }

  cumpleCriteriosBusqueda(invitado: string, busqueda: string) {
    switch (invitado) {
      case 'rubia':
        const vRubia: string[] = ['m', 'mi', 'mir', 'miri', 'miria', 'miriam'];
        return vRubia.includes(busqueda.toLowerCase())
        || invitado.toLowerCase().includes(busqueda.toLowerCase()) 
        || this.coincideSinTildes(invitado, busqueda); 
      
      case 'busti':
        const vBusti: string[] = ['b', 'be', 'bea', 'beat', 'beatr', 'beatri', 'beatriz']
        return vBusti.includes(busqueda.toLowerCase()) 
          || invitado.toLowerCase().includes(busqueda.toLowerCase()) 
          || this.coincideSinTildes(invitado, busqueda);

      default:
        return invitado.toLowerCase().includes(busqueda.toLowerCase()) || this.coincideSinTildes(invitado, busqueda);
    }
  }

  coincideSinTildes(invitado: string, busqueda: string) {
    var invSinTildes: string = invitado;
    var busquedaSinTildes: string = busqueda;

    this.acentos.forEach( item => {
      invSinTildes = invSinTildes.replace( item.conTilde, item.sinTilde );
      busquedaSinTildes = busquedaSinTildes.replace( item.conTilde, item.sinTilde );
    })
    return invSinTildes.toLowerCase().includes(busquedaSinTildes.toLowerCase());
  }

}

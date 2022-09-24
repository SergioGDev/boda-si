import { Component, Input, OnInit } from '@angular/core';
import { VERTICAL, HORIZONTAL, Nombre, Color, Celda } from '../../../../interfaces/sopa-letras.interfaces';
import { SopaLetrasService } from '../../../../services/sopa-letras.service';

@Component({
  selector: 'app-sopa-letras',
  templateUrl: './sopa-letras.component.html',
  styleUrls: ['./sopa-letras.component.css']
})
export class SopaLetrasComponent implements OnInit {

  // heroeSt: string = 'Spiderman';
  // vNombres: string[] = ['Merche', 'Lito', 'Toñi', 'Juanma', 
  //   'Mercedes', 'Manuel', 'Moi', 'Ainoha']
  @Input() heroeSt!: string;
  @Input() vNombres!: string[];

  mapa: Celda[][] = [];
  vColocados: Nombre[] = [];

  constructor(private sopaLetrasService: SopaLetrasService) { }

  ngOnInit(): void {
    this.generarMapa();
  }

  generarMapa() {
    console.log('GENERAR MAPA');

    this.sopaLetrasService.inicializarMapa();
    // Colocamos al heroe
    const heroe: Nombre = this.sopaLetrasService.obtenerNombre(this.heroeSt, 1, VERTICAL);

    this.sopaLetrasService.colocarHeroe(heroe);

    var prioridad = 2;
    var ori = HORIZONTAL;
    var iteraciones = 0;
    do {

      this.vNombres.forEach(nombre => {
        var n = this.sopaLetrasService.obtenerNombre(nombre, prioridad, ori);
        if (this.sopaLetrasService.colocarNombre(n)) {
          this.vNombres.splice(this.vNombres.indexOf(nombre), 1);
        }
      })
      ori = (ori === HORIZONTAL) ? VERTICAL : HORIZONTAL;
      prioridad++;
      iteraciones++;
    } while (this.vNombres.length > 0 && iteraciones < 30);

    this.sopaLetrasService.rellenarHuecosVacios();
    this.mapa = this.sopaLetrasService.getMapa();
    this.vColocados = this.sopaLetrasService.getVColocados();
    this.vColocados.splice(this.vColocados.indexOf(heroe), 1);
  }

  getColorString(color: Color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
  }

}

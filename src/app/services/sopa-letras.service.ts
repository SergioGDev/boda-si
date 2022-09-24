import { Injectable } from '@angular/core';
import { Celda, Nombre, Coordenada, VERTICAL, HORIZONTAL, Color } from '../interfaces/sopa-letras.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SopaLetrasService {
  vColocados: Nombre[] = [];
  m: Celda[][] = this.inicializarMapa();

  constructor() { }

  inicializarMapa(): Celda[][] {
    const max: number = 20;
    var m: Celda[][] = [];

    for (var i = 0; i < max; i++) {
      m[i] = [];
      for (var j = 0; j < max; j++) {
        m[i][j] = { 
          letra: ' ', 
          esHeroe: false, 
          coordenada: { x: i, y: j },
          orientaciones: [],
          color: {r: 255, g: 255, b: 255}
        }
      }
    }

    this.m = m;
    this.vColocados = [];
    return m;
  }

  // Muestra el mapa por consola
  mostrarMapa(): void {
    let dibujo = '';
    dibujo += '   - 0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 0 - 11- 12- 13- 14- 20- 16- 17- 18- 19-\n'
    dibujo += '   ---------------------------------------------------------------------------------\n';
    for (var i = 0; i < this.m.length; i++) {
      dibujo += (i<10) ? `${i}  ` : `${i} `;
      for (var j = 0; j < this.m[i].length; j++) {
        dibujo += `| ${this.m[i][j].letra ? this.m[i][j].letra : ' '} `;
      }
      dibujo += '|\n   ---------------------------------------------------------------------------------\n';
    }

    console.log(dibujo);
  }

  getMapa(): Celda[][] {
    return this.m;
  }

  getVColocados(): Nombre[] {
    return this.vColocados;
  }

  rellenarHuecosVacios(): void {
    const biblio: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.m.forEach( fila => {
      fila.forEach( celda => {
        if (celda.letra == ' ') {
          celda.letra = biblio.charAt(this.getRandomInt(biblio.length));
        }
      })
    })
  }

  colocarNombre(nuevoNombre: Nombre): boolean {
    var colocado = false;
    this.vColocados.forEach(nombreColocado => {
      if (!colocado && (nombreColocado.prioridad === nuevoNombre.prioridad - 1) &&
        (nuevoNombre.orientacion !== nombreColocado.orientacion)) {

        const celdasCoincidentes = this.getCoincidencias(nombreColocado, nuevoNombre);
        colocado = this.insertarNombreEnMapa(celdasCoincidentes, nuevoNombre);
      }
    })

    return colocado;
  }

  // Coloca al héroe dentro del mapa
  colocarHeroe(heroe: Nombre): void {
    
    const cInicio: Coordenada = {
      x: this.getRandomInt(20 - heroe.texto.length),
      y: (this.getRandomInt(5) + 4)
    }

    for (var i = cInicio.x; i < (cInicio.x + heroe.texto.length); i++) {
      this.m[i][cInicio.y] = heroe.letras[i - cInicio.x];
      heroe.letras[i - cInicio.x].coordenada = { x: i, y: cInicio.y }
    }

    this.vColocados.push(heroe);
  }


  // ********************************************************* //
  // ********             MÉTODOS AUXILIARES            ****** //
  // ********************************************************* //

  // Comprueba si hay coincidencia de letras. En caso de haberla, devuelve las celdas donde coinciden.
  getCoincidencias(n1: Nombre, n2: Nombre) {
    let vCeldas: Celda[] = [];

    n1.letras.forEach(l1 => {
      n2.letras.forEach(l2 => {
        if (l1.letra === l2.letra) {
          // console.log({
          //   letra: l1.letra,
          //   esHeroe: (l1.esHeroe || l2.esHeroe),
          //   coordenada: l1.coordenada,
          //   orientaciones: [VERTICAL, HORIZONTAL],
          //   color: this.mezclarColores(n1.color, n2.color)
          // });
          vCeldas.push({
            letra: l1.letra,
            esHeroe: (l1.esHeroe || l2.esHeroe),
            coordenada: l1.coordenada,
            orientaciones: [VERTICAL, HORIZONTAL],
            color: this.mezclarColores(n1.color, n2.color)
          })
        }
      })
    })

    return vCeldas;
  }

  insertarNombreEnMapa(vCoincidencias: Celda[], nombre: Nombre) {

    let insertado: boolean = false;
    vCoincidencias.forEach(coincidencia => {
      if (!insertado) {

        // Buscamos la coordenada
        var i = 0;
        var flag = false;
        do {
          if (nombre.letras[i].letra === coincidencia.letra) {
            flag = true;
            nombre.letras[i].coordenada = coincidencia.coordenada;
          } else {
            i++;
          }
        } while (!flag && i < nombre.letras.length);

        // Comprobamos que no excede el mapa
        if (nombre.orientacion === VERTICAL
          && nombre.letras[i].coordenada!.x - i >= 0    // xInicio
          && ((nombre.letras[i].coordenada!.x - i) + nombre.texto.length - 1) < 20) {   // xFin

          const xInicio = nombre.letras[i].coordenada!.x - i;
          const xFin = xInicio + nombre.texto.length - 1;
          
          console.log('Nombre:', nombre);
          console.log('i:', i, ', xInicio:', xInicio, ', xFin:', xFin);
          
          for (var k = xInicio; k <= xFin; k++) {
            nombre.letras[k - xInicio].coordenada = { x: k, y: coincidencia.coordenada!.y };
          }
          

          if (this.puedoInsertarNombreEnMapa(nombre)) {
            // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
            // console.log('-> Nombre a insertar <-\n', nombre);
            // console.log('---> MAPA <---');

            for (var k = xInicio; k <= xFin; k++) {
              this.m[k][coincidencia.coordenada!.y] = (k === coincidencia.coordenada!.x)
                ? coincidencia : nombre.letras[k - xInicio];
            }
            insertado = true;
            // this.mostrarMapa();
            this.vColocados.push(nombre);
            // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
          }

        } else if (nombre.orientacion === HORIZONTAL
          && nombre.letras[i].coordenada!.y - i >= 0
          && ((nombre.letras[i].coordenada!.y - i) + nombre.texto.length - 1) < 20) {

          const yInicio = nombre.letras[i].coordenada!.y - i;
          const yFin = yInicio + nombre.texto.length - 1;

          for (var k = yInicio; k <= yFin; k++) {
            nombre.letras[k - yInicio].coordenada = { x: coincidencia.coordenada!.x, y: k }
          }

          if (this.puedoInsertarNombreEnMapa(nombre)) {
            for (var k = yInicio; k <= yFin; k++) {
              this.m[coincidencia.coordenada!.x][k] = (k === coincidencia.coordenada!.y)
                ? coincidencia : nombre.letras[k - yInicio];
            }
            insertado = true;
            // this.mostrarMapa();
            this.vColocados.push(nombre);
          }
        }
      }

    })

    return insertado;
  }

  // Obtiene la entidad Nombre asociada al nombre.
  obtenerNombre(nombre: string, prioridad: number, orientacion: string): Nombre {
    const color: Color = { r: this.getRandomInt(256), g: this.getRandomInt(256), b: this.getRandomInt(256)}
    const letras: Celda[] = nombre.split('')
      .map(l => { 
        return { 
          letra: l.toUpperCase(), 
          esHeroe: prioridad === 1,
          orientaciones: [orientacion],
          color
        }
      });
    return {
      texto: nombre,
      prioridad,
      orientacion,
      letras,
      color
    }
  }

  puedoInsertarNombreEnMapa(nombre: Nombre): boolean {
    const cInicio = nombre.letras[0].coordenada!;
    const cFin = nombre.letras[nombre.texto.length - 1].coordenada!;
    const orientacion = nombre.orientacion;

    const inicio = (orientacion === 'H') ? cInicio.y : cInicio.x;
    const fin = (orientacion === 'H') ? cFin.y : cFin.x;

    // console.log(nombre)

    for (let k = inicio; k <= fin; k++) {

      // console.log(`Posición: [${cFin.x}, ${k}]`)

      if (orientacion === HORIZONTAL && this.m[cFin.x][k].letra !== ' '
        && this.m[cFin.x][k].letra != nombre.letras[k - inicio].letra) {
        return false;
      } else if (orientacion === VERTICAL && this.m[k][cFin.y].letra != ' '
        && this.m[k][cFin.y].letra != nombre.letras[k - inicio].letra) {
        return false;
      }

    }
    return true;
  }

  getMaximaPrioridadEnMapa() {
    let max: number = -1;
    this.vColocados.forEach(nombre => {
      max = (nombre.prioridad > max) ? nombre.prioridad : max;
    })

    return max;
  }

  mezclarColores(c1: Color, c2: Color): Color {
    return {
      r: (c1.r + c2.r) / 2,
      g: (c1.g + c2.g) / 2,
      b: (c1.b + c2.b) / 2
    }
  }

  // Obtiene un número aleatorio con máximo indicado
  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}

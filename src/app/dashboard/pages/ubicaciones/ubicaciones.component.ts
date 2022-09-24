import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements AfterViewInit, OnInit {

  centerIglesia: [number, number] = [-6.07987967275465, 40.06193837264466];
  centerParador: [number, number] = [-6.094094531103214, 40.02918737941208];

  zoomParador: number = 16;
  zoomIglesia: number = 15;
  
  containerIglesia: string = 'mapaIglesia';
  containerParador: string = 'mapaParador';
  containerParador2: string = 'mapaParador2'

  ubicacionIglesia: string = "https://www.google.com/maps/place/Santuario+de+Nuestra+Se%C3%B1ora+del+Puerto/@40.0618776,-6.0818982,17z/data=!3m1!4b1!4m5!3m4!1s0xd3e160f40a550fb:0xe88a4d3fd88ddc91!8m2!3d40.0619512!4d-6.0798938";
  ubicacionParador: string = "https://www.google.com/maps/place/Parador+de+Plasencia/@40.0291874,-6.0962725,17z/data=!3m1!4b1!4m8!3m7!1s0xd3e164b9c9b1465:0x44caa32733429e63!5m2!4m1!1i2!8m2!3d40.0291874!4d-6.0940838";

  constructor() { }

  ngOnInit(): void {
    window.scroll({ 
      top: 0, 
      left: 0
    });
  }

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    
    // Iglesia
    var mapaIglesia = new mapboxgl.Map({
      container: this.containerIglesia,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerIglesia,
      zoom: this.zoomIglesia,
      scrollZoom: false
    });

    const markerIglesia = new mapboxgl.Marker()
      .setLngLat(this.centerIglesia)
      .addTo(mapaIglesia);

    // Parador
    var mapaParador = new mapboxgl.Map({
      container: this.containerParador,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerParador,
      zoom: this.zoomParador,
      scrollZoom: false
    });

    const markerParador = new mapboxgl.Marker()
      .setLngLat(this.centerParador)
      .addTo(mapaParador);

    // Parados 2
    var mapaParador2 = new mapboxgl.Map({
      container: this.containerParador2,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerParador,
      zoom: this.zoomParador,
      scrollZoom: false
    });

    const markerParador2 = new mapboxgl.Marker()
      .setLngLat(this.centerParador)
      .addTo(mapaParador);

  }



}

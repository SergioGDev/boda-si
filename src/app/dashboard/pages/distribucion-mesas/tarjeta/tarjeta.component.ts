import { Component, Input, OnInit } from '@angular/core';
import { MesaSchema } from '../../../../interfaces/datos.interfaces';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit {

  @Input() mesa!: MesaSchema;

  verReverso: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-input-busqueda',
  templateUrl: './input-busqueda.component.html',
  styleUrls: ['./input-busqueda.component.css']
})
export class InputBusquedaComponent implements OnInit {

  @Output('eventoBusqueda') eventoBusqueda = new EventEmitter<string>();
  @ViewChild('inputBusqueda') inputBusqueda!: ElementRef;
  
  constructor(
    private fb: FormBuilder
    ) { }
  
  formBusqueda: FormGroup = this.fb.group({
    busqueda: []
  })
    
  ngOnInit(): void {
  }

  emitirBusqueda() {
    const busqueda = this.formBusqueda.get('busqueda')?.value;
    this.eventoBusqueda.emit(busqueda ? busqueda : '');
  }

  clickCheck() {
    console.log(this.inputBusqueda)
    of('').pipe(
      delay(250)
    ).subscribe( () => this.inputBusqueda.nativeElement.focus());
  }
}

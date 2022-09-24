import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvitadoSchema } from '../../../interfaces/datos.interfaces';
import { DataFunctionService } from '../../../services/data-function.service';

@Component({
  selector: 'app-load-csv',
  templateUrl: './load-csv.component.html',
  styleUrls: ['./load-csv.component.css']
})
export class LoadCsvComponent implements OnInit {

  @Output() onLoadCsv = new EventEmitter<any[]>();

  @Input() textoBoton: string = 'Cargar fichero CSV';

  constructor(
    private dataFunctionService: DataFunctionService
  ) { }

  ngOnInit() {
  }

  csvInputChange($event: any){
    const file: File = $event.target.files[0];
    if(!file || !file.name.endsWith('.csv')){
      console.log('EL FICHERO TIENE QUE SER CSV');
      return;
    }
    try{
      //read csv
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        const invitados: InvitadoSchema[] = this.csvToArray(csv);
        this.onLoadCsv.emit(invitados);
      }
    }catch(error){
      console.log(error);
    }
  }

  csvToArray(csv: string){
    const lines = csv.split('\n');
    const result: InvitadoSchema[] = [];

    lines.forEach( line => {
      const v = line.replace('\r', '').split(';');
      const obj: InvitadoSchema = {
        nombre: v[0], 
        categoria: v[1]
      }
      result.push(obj);
    })

    return result;
  }

}

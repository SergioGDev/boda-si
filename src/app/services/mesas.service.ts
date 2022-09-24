import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MesaSchema } from '../interfaces/datos.interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  urlMesa: string = 'api/mesa';
  urlMesas: string = 'api/mesas';

  constructor(
    private http: HttpClient
  ) { }

  guardarMesa(mesa: MesaSchema): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/${this.urlMesa}`, mesa);  
  }

  guardarMesas(vMesas: MesaSchema[]): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/${this.urlMesa}`, vMesas);
  }

  obtenerListadoMesas(): Observable<any> {
    console.log(`${environment.backendUrl}/${this.urlMesa}`)
    return this.http.get<any>(`${environment.backendUrl}/${this.urlMesa}`);
  }

  modificarMesa(datosMesa: MesaSchema): Observable<any> {
    return this.http.put<any>(`${environment.backendUrl}/${this.urlMesa}/${datosMesa._id!}`, datosMesa);
  }

  eliminarMesa(idMesa: string): Observable<any> {
    return this.http.delete<any>(`${environment.backendUrl}/${this.urlMesa}/${idMesa}`);
  }

  eliminarTodasLasMesas(): Observable<any> {
    return this.http.delete<any>(`${environment.backendUrl}/${this.urlMesas}`);
  }
}

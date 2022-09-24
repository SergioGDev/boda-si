import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MesaSchema } from '../interfaces/datos.interfaces';
import { Observable } from 'rxjs';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MesasFireService {

  constructor(
    private db: AngularFirestore,
    private firestore: Firestore
  ) { }

  obtenerListadoMesas(): Observable<any> {
    // const invitados = this.db.collection<InvitadoSchema>('invitados').get();
    //     return invitados
    const mesas = this.db.collection<MesaSchema>('mesas').valueChanges();
    return mesas;
  }
  
  guardarMesa(mesa: MesaSchema) {
    mesa.id = this.db.createId();
    const mesaRef = collection(this.firestore, 'mesas');
    return addDoc(mesaRef, mesa);

  }

  guardarMesas(vMesas: MesaSchema[]) {
    // vMesas.forEach( mesa => {
    //   mesa.id = this.db.createId();
    //   this.db.collection<MesaSchema>('mesas').add(mesa);
    // })

    // return this.obtenerListadoMesas();
    return Promise.all(vMesas.map( mesa => this.guardarMesa(mesa)));
  }
}

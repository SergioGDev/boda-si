import { Injectable } from '@angular/core';
import { InvitadoSchema } from '../interfaces/datos.interfaces';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvitadosFireService {

    constructor(
        private db: AngularFirestore
    ) {  }

    obtenerListadoInvitados() {
        return this.db.collection<InvitadoSchema>('invitados').valueChanges();
    }

    guardarInvitado(invitado: InvitadoSchema) {
        invitado.id = this.db.createId();
        return this.db.collection<InvitadoSchema>('invitados').add(invitado);
    }
    
    guardarInvitados(vInvitados: InvitadoSchema[]) {
        // vInvitados.forEach( invitado => {
        //     console.log('Invitado guardado.')
        //     const id = this.db.createId();
        //     invitado.id = id;
        //     this.db.collection<InvitadoSchema>('invitados').add(invitado);
        // })
    }

    actualizarInvitado(datosInvitado: InvitadoSchema, id: string) {
        return this.db.collection<InvitadoSchema>('invitados')
            .doc(id)
            .update({
                ...datosInvitado
            })
    }

    eliminarInvitado(id: string) {
        return this.db.collection<InvitadoSchema>('invitados')
            .doc(id)
            .delete();
    }

    eliminarTodosLosInvitados() {
        return this.db.collection<InvitadoSchema>('invitados')
            .doc().delete();
    }

    cambiarNombreCategoria(nombreAntiguo: string, nombreNuevo: string) {

    }
}

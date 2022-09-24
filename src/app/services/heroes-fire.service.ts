import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HeroeSchema } from '../interfaces/datos.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeroesFireService {

  constructor(
    private db: AngularFirestore
  ) { }


  obtenerListadoHeroes(): Observable<any> {
    const heroes = this.db.collection<HeroeSchema>('heroes').valueChanges();
    return heroes;
  }
}

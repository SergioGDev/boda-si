import { Injectable } from '@angular/core';
import { Option } from '../interfaces/dashboard.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EnlacesService {

  constructor() { }

  getOpcionesConfiguracion(): Option[] {
    return [
      // { text: 'Galería', path: '/dashboard/galeria', icono: 'photo_camera' },
      // { text: 'Gestión invitados', path: '/dashboard/gestion-invitados', icono: 'person_outline' },
      { text: 'Ubicaciones', path: '/dashboard/ubicaciones', icono: 'my_location' },
      { text: 'Invitados', path: '/dashboard/distribucion-mesas', icono: 'restaurant' },
      // { text: 'Logout', path: '/inicio', icono: 'highlight_off' },
    ]
  }
}

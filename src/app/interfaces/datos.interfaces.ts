export interface InvitadoSchema {
    id?:             string;
    _id?:           string;
    __v?:           string
    nombre:         string;
    categoria?:     string;
    mesa?:          string;
    mesaSchema?:    MesaSchema;
}

export interface MesaSchema {
    id?:                 string;
    _id?:               string;
    __v?:               string;
    nombre:             string;
    numeroInvitados?:   number;
    heroe?:             string;
    heroeSchema?:       HeroeSchema;
    mostrando?:         boolean;
    vInvitados?:        string[];
}

export interface HeroeSchema {
    id?:             string;
    nombre:         string;
    pathImagen:     string;
    _id?:           string;
    __v?:           string;
}

export const NOMBRE_ASC = 'NOMBRE_ASC';
export const NOMBRE_DESC = 'NOMBRE_DESC';
export const MESA_ASC = 'MESA_ASC';
export const MESA_DESC = 'MESA_DESC';
export const NUMERO_ASC = 'NUMERO_ASC';
export const NUMERO_DESC = 'NUMERO_DESC';
export const HEROE_ASC = 'HEROE_ASC';
export const HEROE_DESC = 'HEROE_DESC';

export interface Coordenada {
    x: number;
    y: number;
}

export interface Nombre {
    texto: string;
    prioridad: number;
    letras: Celda[];
    orientacion: string;
    color: Color;
}

export interface Color {
    r: number;
    g: number;
    b: number;
}

export interface Celda {
    letra: string;
    esHeroe: boolean;
    coordenada?: Coordenada;
    orientaciones: string[];
    color: Color;
}

export const VERTICAL = 'V';
export const HORIZONTAL = 'H';
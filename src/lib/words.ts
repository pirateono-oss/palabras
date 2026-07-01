// Spanish word dictionary for anagram/word solving
// Common Spanish words with 3-8 letters
export const spanishWords: string[] = `
sol mar sol paz flor río sol luna casa rosa
perro gato casa mesa silla libro agua fuego tierra cielo
vida amor paz bien mal alto bajo rojo azul verde
grande pequeño bonito feo bueno malo nuevo viejo
comer beber dormir correr saltar hablar leer escribir
cantar bailar jugar reir llorar mirar sentir pensar
alegre triste caliente frío suave duro rápido lento
campo playa monte río mar lago bosque selva
arbol flor fruta pan leche queso carne sopa
padre madre hermano hermana hijo hija abuelo abuela
amigo enemigo jefe alumno maestro doctor rey reina
lunes martes miércoles jueves viernes sábado domingo
enero febrero marzo abril mayo junio julio agosto
septiembre octubre noviembre diciembre
rojo verde azul amarillo blanco negro gris marrón
rosa naranja violeta oro plata bronce cobre
feliz triste cansado contento enojado sorprendido
cabeza mano pie brazo pierna ojo boca nariz
diente pelo uña dedo sangre hueso piel
cocina baño cuarto sala puerta ventana techo
suelo pared luz sombra espejo cama mesa silla
reloj llave bolso ropa zapato anillo collar
Perro Gato casa árbol libro agua fuego vino
toro torre rata rama rana raro risa ruta
sapo sopa salta salsa sello selva siete suave
tela taza teléfono teatro tiempo tierra tomate torre
alto bajo bueno malo bonito feo grande chico
largo corto ancho fino gordo flaco nuevo viejo
caliente frío suave duro dulce amargo salado ácido
rápido lento vivo muerto abierto cerrado lleno vacío
claro oscuro limpio sucio rico pobre caro barato
fácil difícil simple complejo seguro peligroso
ayer hoy mañana siempre nunca tarde pronto
aquí allí cerca lejos arriba abajo dentro fuera
antes después durante mientras hasta desde
amistad familia trabajo escuela ciudad país mundo
calle plaza parque museo teatro cine hotel banco
tienda mercado frutería panadería carnicería farmacia
guitarra piano violín flauta tambor música canción
fútbol tenis boxeo golf hockey balón cancha equipo
película libro cuento poema novela drama risa llanto
verano invierno otoño primavera lluvia nieve viento
sol luna estrella cielo nube rayo trueno arcoíris
` .trim().split(/\s+/).filter(w => w.length >= 3).map(w => w.toLowerCase());

// Build lookup: sorted letters -> words
export function buildAnagramMap(words: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const word of words) {
    const key = word.split('').sort().join('');
    const existing = map.get(key) || [];
    existing.push(word);
    map.set(key, existing);
  }
  return map;
}

export const anagramMap = buildAnagramMap(spanishWords);

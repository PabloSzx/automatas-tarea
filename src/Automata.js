import Stack from "stackjs";
import Queue from "queue-fifo";
import { forEach, get, set } from "lodash";

export default class Automata {
  constructor(transitions = [], initialState = "", endState = undefined) {
    this.transitions = {}; /* Inicializar hash de transiciones */
    this.word = new Queue(); /* Inicializar cola de palabra a analizar */
    this.stack = new Stack(); /* Inicializar stack de memoria */
    this.stack.push("R"); /* Valor inicial por default de stack */
    this.currentState = initialState; /* Definir el estado inicial */
    this.endState = endState; /* Definir estado final si existe */
    forEach(
      /* Iteramos sobre la lista de transiciones obtenidas de la interfaz */
      transitions,
      ({ state, symbol, stack_from, state_to, stack_to }) => {
        set(this.transitions, [state, stack_from, symbol], {
          /* Agregamos la nueva direccion en el hash de transiciones con la informacion de la transicion iterada */
          state_to,
          stack_to
        });
      }
    );
  }

  /* Funcion auxiliar para dar vuelta un string */
  reverse = s => (s === "" ? "" : this.reverse(s.substr(1)) + s.charAt(0));

  replaceStack(stack_to) {
    /* Funcion para hacer el reemplazo en el stack de memoria */
    stack_to = stack_to === "ε" ? "" : stack_to;
    /* Si vamos a reemplazar con vacio, quitamos epsilon para su uso como "vacio" */
    this.stack.pop(); /* Quitamos el tope del stack */
    for (const c of this.reverse(stack_to)) this.stack.push(c);
    /* Iteramos sobre lo que vamos a reemplazar (de forma invertida), e insertamos el valor al stack */
  }

  analizarPalabra(input) {
    /* Funcion que utilizamos para determinar si una palabra es aceptada */
    for (const c of input) this.word.enqueue(c);
    /* Guardamos en forma de cola la palabra a analizar */

    while (
      /* Si existe endState, la condicion del while es si currentState es distinto de endState */
      /* Si no existe endState, la condicion del while es si se acabó el stack */
      this.endState
        ? this.currentState !== this.endState
        : !this.stack.isEmpty() /* OPERADOR TERNARIO PARA SIMPLIFICAR CODIGO */
    ) {
      const c = this.word.dequeue(); /* Separamos el simbolo a analizar de la subpalabra que queda */
      const { state_to, stack_to } =
        get(this.transitions, [this.currentState, this.stack.peek(), c]) || {};
      /* Guardamos (si existen) los valores asociadas al estado actual, tope del stack, y caracter a analizar */
      /* Buscamos en el hash, si no existen, los valores quedan como undefined */

      if (!state_to || !stack_to) return false;
      /* Si la transicion no está definida, la palabra es rechazada */
      this.currentState = state_to; /* Cambiamos el estado actual por el correspondiente a la transición */
      this.replaceStack(stack_to);
      /* Hacemos el reemplazo en el stack de memoria por el correspondiente a la transicion */
    }

    /* Finalizado el loop sobre el analisis sobre la palabra */
    /* Si existe endState, se returna true si currentState es igual a endState */
    /* Si no existe endState, se retorna true si se acabó el stack */
    return this.endState
      ? this.currentState === this.endState
      : this.stack.isEmpty();
  }
}

import Stack from "stackjs";
import Queue from "queue-fifo";
import { forEach, merge, get } from "lodash";

export default class Automata {
  constructor(transitions = [], initialState = "", endState = undefined) {
    this.transitions = {};
    this.word = new Queue();
    this.stack = new Stack();
    this.stack.push("R");
    this.currentState = initialState;
    this.endState = endState;
    forEach(transitions, value => {
      /* Iteramos sobre la lista de transiciones obtenidas de la interfaz */
      const { state, symbol, stack_from, state_to, stack_to } = value;

      merge(this.transitions, {
        [state]: {
          /* Se une lo que se tenia antes en transiciones mas la nueva transicion */
          [stack_from]: {
            [symbol]: { state_to, stack_to }
          }
        }
      });
    });
  }

  reverse = s => (s === "" ? "" : this.reverse(s.substr(1)) + s.charAt(0));

  replaceStack(stack_to) {
    stack_to = stack_to === "ε" ? "" : stack_to;
    this.stack.pop();
    for (const c of this.reverse(stack_to)) this.stack.push(c);
  }

  analizarPalabra(input) {
    for (const c of input) this.word.enqueue(c);

    while (
      /* Primero se verifica si queda alguna subpalabra por analizar */
      /* Despues, Si existe endState, la condicion del while es si currentState es distinto de endState */
      /* Si no existe endState, la condicion del while es si se acabó el stack */
      !this.word.isEmpty() && this.endState
        ? this.currentState !== this.endState
        : !this.stack.isEmpty()
    ) {
      const c = this.word.dequeue();
      const { state_to, stack_to } =
        get(this.transitions, [this.currentState, this.stack.peek(), c]) || {};
      if (!state_to || !stack_to)
        return false; /* Si la transicion no está definida, la palabra es rechazada */
      this.currentState = state_to;
      this.replaceStack(stack_to);
    }

    return this.endState
      ? this.currentState === this.endState
      : this.stack.isEmpty();
  }
}

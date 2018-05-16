import Stack from "stackjs";
import Queue from "queue-fifo";
import { forEach, merge, get, set } from "lodash";

export default class Automata {
  constructor(transitions = [], initialState = "", endState = undefined) {
    this.transitions = {};
    this.word = new Queue();
    this.stack = new Stack();
    this.stack.push("R");
    this.currentState = initialState;
    this.endState = endState;
    forEach(
      transitions,
      ({ state, symbol, stack_from, state_to, stack_to }) => {
        /* Iteramos sobre la lista de transiciones obtenidas de la interfaz */
        set(this.transitions, [state, stack_from, symbol], {
          state_to,
          stack_to
        });
      }
    );
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
      /* Si existe endState, la condicion del while es si currentState es distinto de endState */
      /* Si no existe endState, la condicion del while es si se acabó el stack */
      this.endState
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

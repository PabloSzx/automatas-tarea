import Stack from "stackjs";
import Queue from "queue-fifo";
import { forEach } from "lodash";

export default class Automata {
  constructor(
    transitions = [],
    states = {},
    initialState = "",
    endState = undefined
  ) {
    this.alfabetoDeEntrada = {};

    this.alfabetoDeStack = {};

    this.alfabetoDeStates = states;

    this.transitions = {};

    this.stack = new Stack();
    this.stack.push("R");
    this.currentState = initialState;
    this.endState = endState;
    this.word = new Queue();

    forEach(transitions, (value, key) => {
      /* Iteramos sobre la lista de transiciones */
      const { state, letter, stack_from, state_to, stack_to } = value;

      if (!this.alfabetoDeEntrada[letter]) {
        this.alfabetoDeEntrada[letter] = true;
      }
      if (!this.alfabetoDeStack[stack_from]) {
        this.alfabetoDeStack[stack_from] = true;
      }
      if (!this.alfabetoDeStack[stack_to]) {
        this.alfabetoDeStack[stack_to] = true;
      } /* Definicion de alfabeto de entrada, alfabeto de stack y alfabeto de states */

      if (this.transitions[state]) {
        if (this.transitions[state][stack_from]) {
          /* Es transitions[state][stack][stack_from] undefined?? */
          this.transitions = {
            ...this.transitions,
            /* Lo que tenia antes la lista de transiciones */
            [state]: {
              ...this.transitions[
                state
              ] /* Lo que teniamos antes en transitions[state][state][stack_from] mas la nueva direccion; Buscamos un Merge, no un Replace */,
              [stack_from]: {
                ...this.transitions[state][stack_from],
                [letter]: { state_to, stack_to }
              }
            }
          };
        } else {
          /* Es transitions[state][stack] undefined?? */
          this.transitions = {
            ...this.transitions,
            [state]: {
              ...this.transitions[
                state
              ] /* Lo que teniamos antes en transitions[state] mas la nueva direccion; Buscamos un Merge, no un Replace */,
              [stack_from]: {
                [letter]: { state_to, stack_to }
              }
            }
          };
        }
      } else {
        /* Es transitions[state] undefined?? */
        this.transitions = {
          /* Por que elegimos esta estructura? porque es del orden O(1) */
          ...this.transitions /* Lo que haya antes en this.transitions */,
          [state]: {
            /* Mas una nueva direccion en this.transitions */
            [stack_from]: {
              [letter]: { state_to, stack_to }
            }
          }
        };
      }
    }); /* Que no se pierda informacion */
  }

  reverseString(str) {
    return str === "" ? "" : this.reverseString(str.substr(1)) + str.charAt(0);
  }

  replaceStack(stack_to) {
    if (stack_to === "ε") {
      stack_to = "";
    }
    this.stack.pop(); /* NECESITO HACER VALIDACION SI EL STACK YA ESTA VACIO??? */
    for (const c of this.reverseString(stack_to)) {
      this.stack.push(c);
    }
  }

  analizarPalabra(word) {
    for (const c of word) {
      this.word.enqueue(c);
    }

    while (
      this.endState /* Existe endState */
        ? this.currentState !==
          this
            .endState /* Si existe endState, la condicion del while es si currentState es distinto de endState */
        : !this.word
            .length /* Si no existe endState, la condicion del while es si se acabo la palabra */
    ) {
      const c = this.word.dequeue();
      if (
        this.alfabetoDeEntrada[c] &&
        this.transitions[this.currentState] &&
        this.transitions[this.currentState][this.stack.peek()] &&
        this.transitions[this.currentState][this.stack.peek()][c]
      ) {
        const trans = this.transitions[this.currentState][this.stack.peek()][c];
        const { state_to, stack_to } = trans;
        this.currentState = state_to;
        this.replaceStack(stack_to);
      } else {
        return false;
      }
    }

    if (
      this.endState
        ? this.currentState === this.endState
        : this.stack.isEmpty() || this.stack.peek() === "ε"
    ) {
      return true;
    }
    return false;
  }
}

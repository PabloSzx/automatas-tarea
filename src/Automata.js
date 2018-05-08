import { stack, queue } from "datastructures-js";
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

    forEach(transitions, (value, key) => {
      const { state, letter, stack_from, state_to, stack_to } = value;

      if (!this.alfabetoDeEntrada[letter]) {
        this.alfabetoDeEntrada[letter] = true;
      }
      if (!this.alfabetoDeStack[stack_from]) {
        this.alfabetoDeStack[stack_from] = true;
      }
      if (!this.alfabetoDeStack[stack_to]) {
        this.alfabetoDeStack[stack_to] = true;
      }

      if (this.transitions[state]) {
        if (this.transitions[state][stack_from]) {
          this.transitions = {
            ...this.transitions,
            [state]: {
              ...this.transitions[state],
              [stack_from]: {
                ...this.transitions[state][stack_from],
                [letter]: { state_to, stack_to }
              }
            }
          };
        } else {
          this.transitions = {
            ...this.transitions,
            [state]: {
              ...this.transitions[state],
              [stack_from]: {
                [letter]: { state_to, stack_to }
              }
            }
          };
        }
      } else {
        this.transitions = {
          ...this.transitions,
          [state]: {
            [stack_from]: {
              [letter]: { state_to, stack_to }
            }
          }
        };
      }
    });
    this.stack = stack();
    this.stack.push("R");
    this.currentState = initialState;
    this.endState = endState;
    this.word = queue();
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

    console.log("stack va en: ", this.stack);
  }

  analizarPalabra(word) {
    for (const c of word) {
      this.word.enqueue(c);
    }

    while (
      this.endState ? this.currentState !== this.endState : !this.word.isEmpty()
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
        console.log(
          "c: ",
          c,
          " currentState: ",
          this.currentState,
          " stackPeek:",
          this.stack.peek()
        );
        return false;
      }
    }

    return true;
  }
}

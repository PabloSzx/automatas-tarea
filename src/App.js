import React, { Component } from "react";
import { map, filter, concat } from "lodash";
import {
  Grid,
  Form,
  Input,
  List,
  Icon,
  Checkbox,
  Divider
} from "semantic-ui-react";
import Automata from "./Automata";

class Transition {
  constructor(state, symbol, stack_from, state_to, stack_to) {
    this.state = state;
    this.symbol = symbol === "" ? "ε" : symbol;
    this.stack_from = stack_from;
    this.state_to = state_to;
    this.stack_to = stack_to === "" ? "ε" : stack_to;
  }
}

class Word {
  constructor(word, pending = true, accepted = false) {
    this.word = "ε" + word;
    this.accepted = accepted;
    this.pending = pending;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transition_state: "",
      transition_symbol: "",
      transition_stack: "",
      transition_state_to: "",
      transition_stack_to: "",
      transitionsList: [],
      initialState: "",
      endCondition: "",
      endState: "",
      inputList: [],
      input: "",
      states: {},
      automata: new Automata(),
      transition_input_focus: 0
    };
  }

  handleKeyPress(event) {
    if (event.key === "Enter")
      switch (this.state.transition_input_focus) {
        case 0:
          this.transition_symbol.focus();
          return;
        case 1:
          this.transition_stack.focus();
          return;
        case 2:
          this.transition_state_to.focus();
          return;
        case 3:
          this.transition_stack_to.focus();
          return;
        case 4:
          this.addTransition();
          return;
        case 5:
          this.addWord();
          return;
        default:
          return;
      }
  }

  async addWord() {
    let valid = await this.updateAutomata();

    if (valid) {
      const { input, automata, inputList } = this.state;

      const accepted = automata.analizarPalabra(input + "ε");
      if (accepted)
        window.$toast(`La palabra "${input}" ha sido aceptada por el autómata`);
      else
        window.$toast(
          `La palabra "${input}" ha sido rechazada por el autómata`
        );
      this.setState({
        /* Actualiza mi informacion dentro de la pagina y renderiza */
        input: "",
        inputList: concat(inputList, new Word(input, false, accepted))
      });

      this.word_input.focus();
    }
  }

  addTransition() {
    const {
      transition_state,
      transition_symbol,
      transition_stack,
      transition_state_to,
      transition_stack_to,
      transitionsList,
      states
    } = this.state;

    if (
      transition_state.length >= 1 &&
      transition_state_to.length >= 1 &&
      transition_symbol.length <= 1 &&
      transition_stack.length <= 1
    ) {
      this.setState({
        transitionsList: concat(
          transitionsList,
          new Transition(
            transition_state,
            transition_symbol,
            transition_stack,
            transition_state_to,
            transition_stack_to
          )
        )
      });

      const trans = {};
      trans[transition_state] = true;
      trans[transition_state_to] = true;

      this.setState({
        /* Actualiza el alfabeto de estados (si es necesario), y limpia los input ocupados */
        states: {
          ...states,
          ...trans
        },
        transition_state: "",
        transition_symbol: "",
        transition_stack: "",
        transition_state_to: "",
        transition_stack_to: ""
      });
      this.transition_state.focus(); /* Hacele focus al Estado actual de la nueva transicion */
    } else
      window.$toast(
        "ERROR! La letra y stack que se esperan, son maximo 1 caracter cada uno y los estados deben tener al menos un caracter"
      );
  }

  removeTransition(index) {
    const { transitionsList } = this.state;
    this.setState({
      /* Actualiza la nueva lista de transiciones quitando la transicion indicada presionando la X */
      transitionsList: filter(
        transitionsList,
        (value, key) => key !== index
      ) /* Itera sobre transisionsList, si el indice del arreglo coincide con el indice de la transicion que se quiere eliminar, la quitamos */
    });
  }

  async updateAutomata() {
    const {
      transitionsList,
      initialState,
      endState,
      endCondition
    } = this.state;

    let valid = false;
    if (initialState.length >= 1 && endCondition !== "")
      if (endCondition === "state") {
        //INITIAL STATE TIENE QUE SER MAYOR IGUAL A UNO
        //SI END CONDITION ES DE STATE, TIENE QUE SER MAYOR IGUAL A UNO
        if (endState.length >= 1) valid = true;
      } else valid = true;

    if (valid) {
      const automata = new Automata(transitionsList, initialState, endState);
      await this.setState({
        automata
      });
    } else window.$toast("Verifique los valores de estado inicial y/o final");

    return valid;
    /* Actualiza el automata con los nuevos datos ingresados, casi tiempo real */
  }

  handleChange(event) {
    /* Function auxiliar para recibir cambios en los input */
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { Row, Column } = Grid;
    const { Item } = List;

    const {
      transition_state,
      transition_symbol,
      transition_stack,
      transition_state_to,
      transition_stack_to,
      transitionsList,
      initialState,
      endCondition,
      endState,
      inputList,
      input,
      states
    } = this.state; /* Todas las variables de this.state que nos van a servir en la renderizacion */
    return (
      <div
        style={{
          "margin-top": "10vh",
          width: "100vw"
        }}
      >
        <Divider />
        <datalist id="states">
          {map(states, (value, key) => <option value={key} />)}
        </datalist>

        <Grid columns={3} centered>
          <Column width={13}>
            <Form>
              <Row stretched columns={5}>
                <Input
                  className="transition"
                  name="transition_state"
                  type="text"
                  list="states"
                  value={transition_state}
                  placeholder="q1"
                  label="Estado actual"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.transition_state = input)}
                  onFocus={() => this.setState({ transition_input_focus: 0 })}
                  onKeyPress={event => this.handleKeyPress(event)}
                />

                <Input
                  name="transition_symbol"
                  className="transition"
                  type="text"
                  value={transition_symbol}
                  placeholder="a"
                  label="Símbolo"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.transition_symbol = input)}
                  onFocus={() => this.setState({ transition_input_focus: 1 })}
                  onKeyPress={event => this.handleKeyPress(event)}
                />

                <Input
                  name="transition_stack"
                  className="transition"
                  type="text"
                  value={transition_stack}
                  placeholder="R"
                  label="Stack"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.transition_stack = input)}
                  onFocus={() => this.setState({ transition_input_focus: 2 })}
                  onKeyPress={event => this.handleKeyPress(event)}
                />
                <Row>
                  <Icon name="arrow circle right" size="normal" />
                </Row>

                <Input
                  name="transition_state_to"
                  className="transition"
                  type="text"
                  list="states"
                  value={transition_state_to}
                  placeholder="q2"
                  label="Estado objetivo"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.transition_state_to = input)}
                  onFocus={() => this.setState({ transition_input_focus: 3 })}
                  onKeyPress={event => this.handleKeyPress(event)}
                />
                <Input
                  name="transition_stack_to"
                  className="transition"
                  type="text"
                  value={transition_stack_to}
                  placeholder="AR"
                  label="Reemplazo stack"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.transition_stack_to = input)}
                  onFocus={() => this.setState({ transition_input_focus: 4 })}
                  onKeyPress={event => this.handleKeyPress(event)}
                />
                <Row>
                  <Icon
                    name="plus square outline"
                    size="big"
                    className="iconButton"
                    ref={input => (this.transition_add = input)}
                    onClick={event => this.addTransition()}
                  />
                </Row>
              </Row>
              <Divider />
              <Row>
                <Input
                  name="initialState"
                  type="text"
                  list="states"
                  value={initialState}
                  placeholder="q1"
                  label="Estado inicial"
                  onChange={event => this.handleChange(event)}
                />
              </Row>

              <Row>
                <Checkbox
                  radio
                  label="Aceptar por stack vacío"
                  value={endCondition}
                  onClick={() => this.setState({ endCondition: "empty" })}
                  checked={endCondition === "empty"}
                />

                <Checkbox
                  radio
                  label="Aceptar por estado final"
                  name="endCondition"
                  value={endCondition}
                  onClick={() => this.setState({ endCondition: "state" })}
                  checked={endCondition === "state"}
                />
              </Row>

              <Row />
              <Row>
                {endCondition === "state" ? (
                  <Input
                    name="endState"
                    type="text"
                    list="states"
                    value={endState}
                    placeholder="q3"
                    label="Estado final"
                    onChange={event => this.handleChange(event)}
                  />
                ) : (
                  <Row />
                )}
              </Row>

              <Divider />

              <Row>
                <Input
                  name="input"
                  type="text"
                  value={input}
                  placeholder="abc"
                  label="Palabra"
                  onChange={event => this.handleChange(event)}
                  ref={input => (this.word_input = input)}
                  onKeyPress={event => this.handleKeyPress(event)}
                  onFocus={() => this.setState({ transition_input_focus: 5 })}
                />
              </Row>
              <Row>
                <Icon
                  name="plus square outline"
                  size="big"
                  className="iconButton"
                  onClick={event => {
                    input
                      ? this.addWord()
                      : window.$toast("Ingrese una palabra valida");
                  }}
                />
              </Row>
            </Form>
          </Column>

          <Column width={3}>
            <List bulleted>
              {map(transitionsList, (value, key) => {
                const { state, symbol, stack_from, state_to, stack_to } = value;
                return (
                  <Item>
                    {`𝛿(${state}, ${symbol}, ${
                      stack_from === "" ? "ε" : stack_from
                    }) = 𝛿(${state_to}, ${stack_to})`}
                    &nbsp; &nbsp;
                    <Icon
                      name="remove"
                      className="iconButton"
                      size="normal"
                      onClick={() => {
                        this.removeTransition(key);
                      }}
                    />
                  </Item>
                );
              })}
            </List>
          </Column>
        </Grid>
        <Divider />

        <Grid stretched columns={1} centered>
          <List>
            {map(inputList, (value, key) => {
              const { word, accepted, pending } = value;

              return (
                <Row>
                  <Item key={key}>
                    {`${word.replace("ε", "")}`}
                    <Icon
                      name={
                        pending
                          ? "refresh"
                          : accepted
                            ? "checkmark box"
                            : "remove circle"
                      }
                      loading={pending}
                    />
                  </Item>
                </Row>
              );
            })}
          </List>
        </Grid>
      </div>
    );
  }
}

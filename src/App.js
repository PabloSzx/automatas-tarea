import React, { Component } from "react";
import { map } from "lodash";
import { Grid, Form, Input, List, Icon, Checkbox } from "semantic-ui-react";
import styled from "styled-components";

import Automata from "./Automata";

const FormInput = styled.div`
  margin-top: 10vh;
`;

class Transition {
  constructor(state, letter, stack, state_to, stack_to) {
    this.state = state;
    if (letter === "") {
      this.letter = "ε";
    } else {
      this.letter = letter;
    }
    this.stack_from = stack;
    this.state_to = state_to;
    if (stack_to === "") {
      this.stack_to = "ε";
    } else {
      this.stack_to = stack_to;
    }
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
    if (event.key === "Enter") {
      switch (this.state.transition_input_focus) {
        case 0:
          this.transition_letter.focus();
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
        default:
          return;
      }
    }
  }

  addTransition() {
    const {
      transition_state,
      transition_letter,
      transition_stack,
      transition_state_to,
      transition_stack_to,
      transitionsList,
      states
    } = this.state;

    this.setState({
      transitionsList: [
        ...transitionsList,
        new Transition(
          transition_state,
          transition_letter,
          transition_stack,
          transition_state_to,
          transition_stack_to
        )
      ]
    });
    const trans = {};
    if (!states[transition_state]) {
      trans[transition_state] = true;
    }
    if (!states[transition_state_to]) {
      trans[transition_state_to] = true;
    }

    this.setState({
      states: {
        ...states,
        ...trans
      },
      transition_state: "",
      transition_letter: "",
      transition_stack: "",
      transition_state_to: "",
      transition_stack_to: ""
    });
    this.transition_state.focus();
  }

  handleChange(event) {
    const { transitionsList, states, initialState, endState } = this.state;
    this.setState({
      [event.target.name]: event.target.value,
      automata: new Automata(transitionsList, states, initialState, endState)
    });
  }
  render() {
    const { Row, Column } = Grid;
    const { Item } = List;

    const {
      transition_state,
      transition_letter,
      transition_stack,
      transition_state_to,
      transition_stack_to,
      transitionsList,
      initialState,
      endCondition,
      endState,
      inputList,
      input,
      states,
      automata
    } = this.state;
    return (
      <FormInput>
        <datalist id="states">
          {map(states, (value, key) => <option value={key} />)}
        </datalist>

        <Grid columns={2}>
          <Column width={13}>
            <Grid centered>
              <Form>
                <Row verticalAlign="middle">
                  <Input
                    className="transition"
                    name="transition_state"
                    type="text"
                    list="states"
                    value={transition_state}
                    placeholder="Estado actual de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                    ref={input => (this.transition_state = input)}
                    onFocus={() => this.setState({ transition_input_focus: 0 })}
                    onKeyPress={event => this.handleKeyPress(event)}
                  />
                  <Input
                    name="transition_letter"
                    className="transition"
                    type="text"
                    value={transition_letter}
                    placeholder="Subpalabra que falta por leer de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                    ref={input => (this.transition_letter = input)}
                    onFocus={() => this.setState({ transition_input_focus: 1 })}
                    onKeyPress={event => this.handleKeyPress(event)}
                  />
                  <Input
                    name="transition_stack"
                    className="transition"
                    type="text"
                    value={transition_stack}
                    placeholder="Contenido del stack de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                    ref={input => (this.transition_stack = input)}
                    onFocus={() => this.setState({ transition_input_focus: 2 })}
                    onKeyPress={event => this.handleKeyPress(event)}
                  />
                  <Icon name="arrow right" />
                  <Input
                    name="transition_state_to"
                    className="transition"
                    type="text"
                    list="states"
                    value={transition_state_to}
                    placeholder="Estado objetivo de la transicion a añadir"
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
                    placeholder="Reemplazo de contenido del stack de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                    ref={input => (this.transition_stack_to = input)}
                    onFocus={() => this.setState({ transition_input_focus: 4 })}
                    onKeyPress={event => this.handleKeyPress(event)}
                  />

                  <Icon
                    name="add"
                    className="iconButton"
                    ref={input => (this.transition_add = input)}
                    onClick={event => this.addTransition()}
                  />
                </Row>

                <Row>
                  <Input
                    name="initialState"
                    type="text"
                    list="states"
                    value={initialState}
                    placeholder="Estado Inicial"
                    onChange={event => this.handleChange(event)}
                  />
                </Row>

                <Row>
                  <Checkbox
                    radio
                    label="Aceptar por stack vacio"
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

                {endCondition === "state" ? (
                  <Row>
                    <Input
                      name="endState"
                      type="text"
                      list="states"
                      value={endState}
                      placeholder="Estado Final"
                      onChange={event => this.handleChange(event)}
                    />
                  </Row>
                ) : (
                  <Row />
                )}

                <Row verticalAlign="middle">
                  <Input
                    name="input"
                    type="text"
                    value={input}
                    placeholder="Palabra de entrada"
                    onChange={event => this.handleChange(event)}
                  />
                  <Icon
                    name="add"
                    className="iconButton"
                    onClick={event => {
                      input
                        ? this.setState({
                            input: "",
                            inputList: [
                              ...inputList,
                              new Word(
                                input,
                                false,
                                automata.analizarPalabra(input + "ε")
                              )
                            ]
                          })
                        : window.$toast("Ingrese una palabra valida");
                    }}
                  />
                </Row>
              </Form>
            </Grid>
          </Column>

          <Column width={3}>
            <List bulleted>
              {transitionsList.map((value, key) => {
                const { state, letter, stack_from, state_to, stack_to } = value;
                return (
                  <Item
                  >{`𝛿(${state}, ${letter}, ${stack_from}) = 𝛿(${state_to}, ${stack_to})`}</Item>
                );
              })}
            </List>
          </Column>
        </Grid>

        <Grid stretched columns={1} centered>
          <List>
            {inputList.map((value, key) => {
              const { word, accepted, pending } = value;

              return (
                <Row>
                  <Item key={key}>
                    {`${word}`}
                    <Icon
                      name={pending ? "refresh" : accepted ? "check" : "x"}
                      loading={pending}
                    />
                  </Item>
                </Row>
              );
            })}
          </List>
        </Grid>
      </FormInput>
    );
  }
}

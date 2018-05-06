import React, { Component } from "react";
import { map } from "lodash";
import { Grid, Form, Input, List, Icon, Checkbox } from "semantic-ui-react";
import styled from "styled-components";

const FormInput = styled.div`
  margin-top: 10vh;
`;

class Transition {
  constructor(state, word, stack, state_to, stack_to) {
    this.state = state;
    this.word = word;
    this.stack = stack;
    this.state_to = state_to;
    this.stack_to = stack_to;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transitionsList: [],
      initial: "",
      endCondition: "",
      endState: "",
      input: "",
      states: {}
    };
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
    console.log(this.state);
    const { Row, Column } = Grid;
    const { Item } = List;

    const {
      transition_state,
      transition_word,
      transition_stack,
      transition_state_to,
      transition_stack_to,
      transitionsList,
      initial,
      endCondition,
      endState,
      input,
      states
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
                <Row>
                  <Input
                    className="transition"
                    name="transition_state"
                    type="text"
                    list="states"
                    value={transition_state}
                    placeholder="Estado actual de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                  />
                  <Input
                    name="transition_word"
                    className="transition"
                    type="text"
                    value={transition_word}
                    placeholder="Subpalabra que falta por leer de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                  />
                  <Input
                    name="transition_stack"
                    className="transition"
                    type="text"
                    value={transition_stack}
                    placeholder="Contenido del stack de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
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
                  />
                  <Input
                    name="transition_stack_to"
                    className="transition"
                    type="text"
                    value={transition_stack_to}
                    placeholder="Reemplazo de contenido del stack de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                  />

                  <Icon
                    name="add"
                    onClick={event => {
                      this.setState({
                        transitionsList: [
                          ...transitionsList,
                          new Transition(
                            transition_state,
                            transition_word,
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

                      this.setState({ states: { ...states, ...trans } });
                    }}
                  />
                </Row>

                <Row>
                  <Input
                    name="initial"
                    type="text"
                    list="states"
                    value={initial}
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

                <Row>
                  <Input
                    name="input"
                    type="text"
                    value={input}
                    placeholder="Palabra de entrada"
                    onChange={event => this.handleChange(event)}
                  />
                </Row>
              </Form>
            </Grid>
          </Column>

          <Column width={3}>
            <List bulleted>
              {transitionsList.map((value, key) => {
                const { state, word, stack, state_to, stack_to } = value;
                return (
                  <Item
                  >{`𝛿(${state}, ${word}, ${stack}) = 𝛿(${state_to}, ${stack_to})`}</Item>
                );
              })}
            </List>
          </Column>
        </Grid>
      </FormInput>
    );
  }
}

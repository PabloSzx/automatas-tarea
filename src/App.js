import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { map } from "lodash";
import { Grid, Form, Input, List, Icon, Checkbox } from "semantic-ui-react";
import styled from "styled-components";

const FormInput = styled.div`
  margin-top: 10vh;
`;

class Transition {
  constructor(state, word, stack) {
    this.state = state;
    this.word = word;
    this.stack = stack;
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
      transitionsList,
      initial,
      endCondition,
      endState,
      input,
      states
    } = this.state;
    return (
      <FormInput>
        <Grid columns={2}>
          <Column width={13}>
            <Grid centered>
              <Form>
                <Row>
                  <Input
                    name="transition_state"
                    type="text"
                    value={transition_state}
                    placeholder="Estado actual de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                  />
                  <Input
                    name="transition_word"
                    type="text"
                    value={transition_word}
                    placeholder="Subpalabra que falta por leer de la transicion a añadir"
                    onChange={event => this.handleChange(event)}
                  />
                  <Input
                    name="transition_stack"
                    type="text"
                    value={transition_stack}
                    placeholder="Contenido del stack de la transicion a añadir"
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
                            transition_stack
                          )
                        ]
                      });
                      if (!states[transition_state]) {
                        this.setState({
                          states: { ...states, [transition_state]: true }
                        });
                      }
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
                  <datalist id="states">
                    {map(states, (value, key) => <option value={key} />)}
                  </datalist>
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
                    <datalist id="states">
                      {map(states, (value, key) => <option value={key} />)}
                    </datalist>
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
                const { state, word, stack } = value;
                return <Item>{`𝛿(${state}, ${word}, ${stack})`}</Item>;
              })}
            </List>
          </Column>
        </Grid>
      </FormInput>
    );
  }
}

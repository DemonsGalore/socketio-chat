import React, { createContext, useReducer } from 'react';

export const Context = createContext();

const reducer = (state, action) => {
  const { from, msg, topic } = action.payload;
  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        [topic]: [
          ...state[topic],
          { from, msg }
        ]
      }
    default:
      return state;
  }
};

const initState = {
  general: [
    { from: 'Andreas', msg: 'general'},
    { from: 'Andreas', msg: 'Hello'},
    { from: 'Andreas', msg: 'Hello'},
  ],
  topic2: [
    { from: 'Andreas', msg: 'topic2'},
    { from: 'Andreas', msg: 'Hello'},
  ]
};

const Store = (props) => {
  const reducerHook = useReducer(reducer, initState);

  return (
    <Context.Provider value={reducerHook}>
      {props.children}
    </Context.Provider>
  );
};

export default Store;

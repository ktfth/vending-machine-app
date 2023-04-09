import React, { useState } from 'react';
import '../VendingMachine.css';

// We have a vending machine who accepts 5, 10, and 25 cent coins.
// We can select A, B, or C.
// A costs 35 cents, B costs 45 cents, and C costs 60 cents.
// If we insert the amount needed each letter, we can select A, B, or C.
// If we insert more than the amount needed, we can select A, B, or C and get change.
// If we insert less than the amount needed, we can select A, B, or C and get an error.
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';

const VendingMachine = () => {
  const [message, setMessage] = useState('');

  const produceInsertStates = (amount, availableValues) => {
    const states = {};
    
    if (!availableValues) {
      availableValues = [5, 10, 25];
    }
    
    if (availableValues.includes(5)) {
      states[`INSERT_5`] = `${amount + 5}`;
    }
  
    if (availableValues.includes(10)) {
      states[`INSERT_10`] = `${amount + 10}`;
    }
  
    if (availableValues.includes(25)) {
      states[`INSERT_25`] = `${amount + 25}`;
    }
  
    return states;
  };
  
  const vendingMachine = createMachine({
    id: 'vendingMachine',
    predictableActionArguments: true,
    initial: '0',
    states: {
      0: {
        on: {
          ...produceInsertStates(0),
          CLEAR: { actions: 'clear' },
        }
      },
      5: {
        on: {
          ...produceInsertStates(5),
          CLEAR: { actions: 'clear' },
        }
      },
      10: {
        on: {
          ...produceInsertStates(10),
          CLEAR: { actions: 'clear' },
        }
      },
      15: {
        on: {
          ...produceInsertStates(15),
          CLEAR: { actions: 'clear' },
        }
      },
      20: {
        on: {
          ...produceInsertStates(20),
          CLEAR: { actions: 'clear' },
        }
      },
      25: {
        on: {
          ...produceInsertStates(25),
          CLEAR: { actions: 'clear' },
        }
      },
      30: {
        on: {
          ...produceInsertStates(30),
          CLEAR: { actions: 'clear' },
        }
      },
      35: {
        on: {
          ...produceInsertStates(35),
          SELECT_A: { target: '0', actions: ['dispenseA'] },
          CLEAR: { actions: 'clear' },
        }
      },
      40: {
        on: {
          ...produceInsertStates(40, [5, 10]),
          SELECT_A: { target: '5', actions: ['dispenseA'] },
          CLEAR: { actions: 'clear' },
        }
      },
      45: {
        on: {
          ...produceInsertStates(45, [5, 10]),
          SELECT_A: { target: '10', actions: ['dispenseA'] },
          SELECT_B: { target: '0', actions: ['dispenseB'] },
          CLEAR: { actions: 'clear' },
        }
      },
      50: {
        on: {
          ...produceInsertStates(50, [5, 10]),
          SELECT_A: { target: '15', actions: ['dispenseA'] },
          SELECT_B: { target: '5', actions: ['dispenseB'] },
          CLEAR: { actions: 'clear' },
        }
      },
      55: {
        on: {
          ...produceInsertStates(55, [5]),
          SELECT_A: { target: '20', actions: ['dispenseA'] },
          SELECT_B: { target: '10', actions: ['dispenseB'] },
          CLEAR: { actions: 'clear' },
        }
      },
      60: {
        on: {
          SELECT_A: { target: '25', actions: ['dispenseA', 'return25'] },
          SELECT_B: { target: '15', actions: ['dispenseB', 'return15'] },
          SELECT_C: { target: '0', actions: 'dispenseC' },
          CLEAR: { actions: 'clear' },
        }
      },
    },
    on: {
      SELECT_A: { actions: 'displayError' },
      SELECT_B: { actions: 'displayError' },
      SELECT_C: { actions: 'displayError' },
      CLEAR: { actions: 'clear' },
    }
  }, {
    actions: {
      dispenseA: (context, event) => {
        setMessage('Dispense A');
      },
      dispenseB: (context, event) => {
        setMessage('Dispense B');
      },
      dispenseC: (context, event) => {
        setMessage('Dispense C');
      },
      return5: (context, event) => {
        setMessage('Return 5');
      },
      return10: (context, event) => {
        setMessage('Return 10');
      },
      return15: (context, event) => {
        setMessage('Return 15');
      },
      displayError: (context, event) => {
        setMessage('No funds!');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      },
      clear: (context, event) => {
        setMessage('');
      }
    }
  });

  const [state, send] = useMachine(vendingMachine);
  
  const handleInsertCoin = (coinValue) => {
    // Handle inserting a coin and updating the vending machine state.
    switch (coinValue) {
      case 5:
        send('INSERT_5');
        break;
      case 10:
        send('INSERT_10');
        break;
      case 25:
        send('INSERT_25');
        break;
      default:
        break;
    }
  };

  const handleSelectItem = (item) => {
    // Handle selecting an item and updating the vending machine state.
    switch (item) {
      case 'A':
        send('SELECT_A');
        break;
      case 'B':
        send('SELECT_B');
        break;
      case 'C':
        send('SELECT_C');
        break;
      default:
        break;
    }
  };

  return (
    <div className="vending-machine">
      <h1>Vending Machine</h1>
      <div className="display">
        <p>{message || state.value}</p>
      </div>
      <div className="coin-insertion">
        <button onClick={() => handleInsertCoin(5)}>Insert 5 cents</button>
        <button onClick={() => handleInsertCoin(10)}>Insert 10 cents</button>
        <button onClick={() => handleInsertCoin(25)}>Insert 25 cents</button>
      </div>
      <div className="item-selection">
        <button onClick={() => handleSelectItem('A')}>Select Item A (35 cents)</button>
        <button onClick={() => handleSelectItem('B')}>Select Item B (45 cents)</button>
        <button onClick={() => handleSelectItem('C')}>Select Item C (60 cents)</button>
      </div>
      <div className="clear-panel">
        <button onClick={() => send('CLEAR')}>Clear</button>
      </div>
    </div>
  );
};

export default VendingMachine;

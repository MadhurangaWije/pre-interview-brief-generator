import { createMachine } from 'xstate';

const machine = createMachine({
    id: 'interviewBriefingStateMachine',
    initial: 'pending',
    states: {
      pending: {
        on: {
          START: 'processing'
        },
      },
      processing: {
        on: {
          COMPLETE: 'completed',
        }
      },
      completed: {
        type: 'final'
      },
      failed: {
        type: 'final'
      }
    }
  });

module.exports = machine;
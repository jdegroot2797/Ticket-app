import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('tix', '123', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // state object to listen to
  const subscription = stan.subscribe('ticket:created');

  // NATS community refers to event as message
  subscription.on('message', (msg) => {
    console.log('message received', msg);
  });
});

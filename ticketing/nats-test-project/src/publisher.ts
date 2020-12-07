import nats from 'node-nats-streaming';

// view only NATS related logs
console.clear();

// stan is instance of NATS client
// community convention is to call the client stan

// use cmd: kubectl port-forward <Pod containing nats service> <outside-port>:<pod-port>
// to allow a connection of local test project to talk to k8s NATS pod.
const stan = nats.connect('tix', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connection to NATS');

  // dummy ticket to try and share
  // NATS only allows sharing of string or raw data, not objects
  // JSON format is ideal here
  const data = JSON.stringify({
    id: '203203',
    title: 'concert',
    price: 40,
  });

  // args - subject, event/message, optional callback
  stan.publish('ticket:created', data, () => {
    console.log('event published');
  });
});

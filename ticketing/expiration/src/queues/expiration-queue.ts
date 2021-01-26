import Queue from 'bull';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  //TODO: publish expiration:complete event for the specific orderIDs

  console.log('expiration:complete event for ', job.data.orderId);
});

export { expirationQueue };

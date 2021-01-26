import nats, { Stan } from 'node-nats-streaming';

// Signleton class for one instance of the class to be
// initialized in te index.ts file and accessed by all files
// within the tickets service
class NatsWrapper {
  private _client?: Stan;

  // typescript getter to check if client is trying to be
  // accessed before the client has connected to the streaming server
  get client() {
    if (!this._client) {
      throw new Error(
        'Cannot access NATS client before the client has successfully connected',
      );
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS from expiration service');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// export a single instace for all files to share
// singleton pattern
export const natsWrapper = new NatsWrapper();

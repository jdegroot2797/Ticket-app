import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@jdtix/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listeners
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test concert',
    price: 400,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message objec
  // @ts-ignore
  const msg: Message = {
    // use jest mock function to keep track of times called and arguments provided
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  // get the listener-
  const { listener, data, msg } = await setup();

  // call the onMessage function with data aand message objects
  await listener.onMessage(data, msg);

  // esnure the ticket was created successfully
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acknowledges the message emitted from the ticket created publisher', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with data aand message objects
  await listener.onMessage(data, msg);

  // esnure the acknowledgement function is called
  expect(msg.ack).toHaveBeenCalled();
});

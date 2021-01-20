import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@jdtix/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test concert',
    price: 100,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'different concert',
    price: 999,
    userId: 'asdsaaj123j12',
  };

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return data
  return { msg, data, ticket, listener };
};

it('find, update, and saves the ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acknowledges the messages', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

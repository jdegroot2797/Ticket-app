import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent } from '@jdtix/common';

const setup = async () => {
  // create the instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create order Id
  const orderId = mongoose.Types.ObjectId().toHexString();

  // create and save the ticket
  const ticket = Ticket.createTicket({
    title: 'test concert',
    price: 201,
    userId: 'asdasadsad',
  });

  // set order id
  ticket.set({ orderId });

  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('updates the ticket to cancelled, publishes the event, and then acknowledges the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  // ensure the orderId is not set (cancelled)
  expect(updatedTicket!.orderId).not.toBeDefined();

  // ensure the message is acknowledged
  expect(msg.ack).toHaveBeenCalled();

  // check if the order cancelled publisher has been called
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

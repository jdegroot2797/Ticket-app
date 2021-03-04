import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent, OrderStatus } from '@jdtix/common';
import { Order } from '../../../models/order';

const setup = async () => {
  // create the instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create order object
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdasdsa',
    price: 100,
  });
  await order.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id ,
    version: 1,
    ticket: {
      id: '2132123s',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }; 

  return { listener, data, msg, order };
};

it('updates the status of the orde to cancelled', async () => {
  const { listener, data, msg, order} = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

});

it('acknowledges the message from the orders publisher', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

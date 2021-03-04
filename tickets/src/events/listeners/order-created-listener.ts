import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@jdtix/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If ticket cannot be found throw an errors
    if (!ticket) {
      throw new Error('Ticket could not be found');
    }

    // Mark the ticket to "reserved" status through orderID
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // create the updated publisher and publish info about the event
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      version: ticket.version,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Acknowledge the message from publisher
    msg.ack();
  }
}

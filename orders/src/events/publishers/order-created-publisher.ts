import { Publisher, Subjects, OrderCreatedEvent } from '@jdtix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttributes {
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;

  // checks if the ticket is already reserved to a valid order already
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.statics.build = (attrs: TicketAttributes) => {
  return new Ticket(attrs);
};

// add new function to ticket document
// cannot use arrow function with mongoose
ticketSchema.methods.isReserved = async function () {
  // this refers to the ticket object/mongoose document
  // returned when querying the mongodb

  // 1. find order in db where the ticket the user is trying to purchase
  // already exists in an order.
  // 2. if the ticket is found AND order status is NOT cancelled.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema,
);

export { Ticket };

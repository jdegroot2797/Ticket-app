import mongoose from 'mongoose';

// properties required to build a ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// properties that a saved record (document in mongo terms) has (signle record)
// note: mongo may add it's on properties once a document is save eg: createdAt
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// properties tied to the Ticket model
interface TicketModel extends mongoose.Model<TicketDocument> {
  createTicket(attrs: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    // this is not for typescript. it is for mongoose therefore types are capitalized
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

// For typescript to help tell what is needed to create a ticket
ticketSchema.statics.createTicket = (attrs: TicketAttributes) => {
  return new Ticket(attrs);
};

// Creation of Ticket model
const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema,
);

export { Ticket };

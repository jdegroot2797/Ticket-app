import { Ticket } from '../ticket';

it('OCC test for the ticket object', async () => {
  // Create instance of tickets
  const ticket = Ticket.createTicket({
    title: 'TEST CONCERT',
    price: 200,
    userId: '21312321321321',
  });

  // Save ticket to db
  await ticket.save();

  // fetch the tickets
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make multiple changes to the tickets
  firstInstance!.set({ price: 15 });
  secondInstance!.set({ price: 45 });

  // save the first fetched ticket (version number should be 1)
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  // the version property should be outdated in this case 0
  // due to the first instance already being incremented to version 1
  await expect(secondInstance!.save()).rejects.toThrow();
});

it('Should increment the version number when ticket is saved multiple times', async () => {
  // Create instance of tickets
  const ticket = Ticket.createTicket({
    title: 'TEST CONCERT',
    price: 200,
    userId: '21312321321321',
  });

  // Save ticket to db
  await ticket.save();

  // version should be at 0 for a new ticket
  expect(ticket.version).toEqual(0);

  // Save ticket to db
  await ticket.save();

  // version should be at 1 for second save
  expect(ticket.version).toEqual(1);

  // Save ticket to db
  await ticket.save();

  // version should be at 2 for third save
  expect(ticket.version).toEqual(2);
});

import buildClient from '../api/build-client';
import Link from 'next/link';

// this is a component (browser)
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

//this is not a components (server)

// next js will call this function while attempting to render
// from the server and will be provided to the component as a prop.
// function will be exected on the server side.

// cannot use hooks outside of components
// must use axios within getInitialProps to see whether user is authed or not

// since this is being called from server therefore our client pod in k8s
// it never reaches the ingress nginx router, node slaps on a localhost domain,
// since this localhost is the pod it results in a connection error.

// will have to route to ingress-nginx to route to auth service and pass along a cookie.

// Window only exist in browser, does not exist in node.js
// with this we now know we are on the server and requests should be made to
// http://<service name>.<namespace name>.svc.cluster.local
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;

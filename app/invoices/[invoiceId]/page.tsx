import getInvoiceById from "@/app/actions/getInvoiceById";
import EmptyState from "@/components/shared/EmptyState";
import InvoiceClient from "./InvoiceClient";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function getUserById(userId: string) {
  if (!userId || typeof userId !== "string") {
    console.error("Invalid userId provided");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/getUserById`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    console.error("Failed to fetch user:", response.statusText);
    return null;
  }

  const user = await response.json();
  console.log("User Data:", user);
  return user;
}



interface IParams {
  invoiceId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const invoice = await getInvoiceById(params);
  const currentUser = await getCurrentUser();

  if (!invoice) {
    return (
      <EmptyState title="404" subtitle="The page doesn't exist" showReset />
    );
  }

  // Fetch user (Mudharib) details if userId is not null
  const user = invoice.userId ? await getUserById(invoice.userId) : null;

  // Fetch investor (Shaibul Mal) details if investorId is not null
  const investor = invoice.investorId ? await getUserById(invoice.investorId) : null;

  // Combine the data into the invoice object
  const enhancedInvoice = {
    ...invoice,
    userName: user?.name || "Unknown User",
    investorName: investor?.name || "Unknown Investor",
    currentRole: currentUser?.role || "Unknown Role",
  };
  console.log(enhancedInvoice);

  return <InvoiceClient invoice={enhancedInvoice} />;
};

export default ListingPage;

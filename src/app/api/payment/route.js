import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.BETTER_AUTH_URL ||
      "http://localhost:3000";

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;

    let price, title, productId, bookingId;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      price = body.price;
      title = body.title;
      productId = body.productId;
      bookingId = body.bookingId;
    } else {
      const formData = await request.formData();
      price = formData.get("price");
      title = formData.get("title");
      productId = formData.get("productId");
      bookingId = formData.get("bookingId");
    }

    const numericPrice = Math.max(1, Number(price) || 1);
    const displayTitle = String(title || "Ticket Booking");

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(numericPrice * 100),
            product_data: {
              name: displayTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        price: String(numericPrice),
        amount: String(numericPrice),
        userId: String(user?.id || ""),
        userEmail: String(user?.email || ""),
        title: displayTitle,
        ticketTitle: displayTitle,
        productId: String(productId || ""),
        bookingId: String(bookingId || ""),
        paymentDate: new Date().toISOString(),
      },
      mode: "payment",
      success_url: `${origin}/pricing/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/buyer/booked-tickets`,
    });

    if (contentType.includes("application/json")) {
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe payment session error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}

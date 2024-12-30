import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
} from "@/lib/actions/community.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const eventType = evt.type;

  if (eventType === "organization.created") {
    const { id: communityId, name, image_url, created_by, slug } = evt.data;
    const community = await createCommunity(
      communityId,
      name,
      image_url,
      created_by,
      slug
    );
    console.log("Created Community :", community);

    return NextResponse.json({
      message: "Community created",
      community: community,
    });
  }

  if (eventType === "organizationMembership.created") {
    const { organization, public_user_data } = evt?.data;

    const community = await addMemberToCommunity(
      organization.id,
      public_user_data.user_id
    );

    console.log("membership:", evt.data);
    console.log("community:", community);

    return NextResponse.json({
      message: "Member added Successfully",
    });
  }

  if (eventType === "organization.deleted") {
    const { id: communityId } = evt.data;
    const deletedCommunity = await deleteCommunity(communityId);

    console.log("Deleted Community :", deletedCommunity);

    return NextResponse.json({
      message: "Community deleted",
      deletedCommunity: deletedCommunity,
    });
  }

  return new Response("Webhook received", { status: 200 });
}

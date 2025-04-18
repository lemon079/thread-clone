import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  addUserToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
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

    const createdCommunity = await createCommunity(
      communityId,
      name,
      image_url as string,
      created_by as string | undefined,
      slug
    );

    console.log("Created Community :", createdCommunity);

    return NextResponse.json({
      message: "Community created",
      community: createdCommunity,
    });
  }

  if (eventType === "organization.deleted") {
    const { id: communityId } = evt.data;
    const deletedCommunity = await deleteCommunity(communityId as string);

    console.log("Deleted Community :", deletedCommunity);

    return NextResponse.json({
      message: "Community deleted",
      deletedCommunity: deletedCommunity,
    });
  }

  if (eventType === "organization.updated") {
    const { id: communityId, image_url, name } = evt.data;
    const updatedCommunity = updateCommunityInfo(communityId, name, image_url);

    NextResponse.json({
      message: "Community deleted",
      updatedCommunity: updatedCommunity,
    });
  }

  if (eventType === "organizationMembership.created") {
    const { organization, public_user_data } = evt?.data;

    // whenever the invited user accepts the invite, that user wll also be added in the db using action below
    await addUserToCommunity(organization.id, public_user_data.user_id);
    return NextResponse.json({
      message: "Member added Successfully",
    });
  }

  if (eventType === "organizationMembership.deleted") {
    try {
      const { organization, public_user_data } = evt?.data;
      console.log("removed", evt?.data);

      await removeUserFromCommunity(public_user_data.user_id, organization.id);

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  return new Response("Webhook received", { status: 200 });
}

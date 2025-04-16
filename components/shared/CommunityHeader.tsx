"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CheckIcon, CirclePlus, LoaderCircle } from "lucide-react";
import { RequestToJoinCommunity } from "@/lib/actions/community.actions";
import { toast } from "sonner";
import { formatDateString } from "@/lib/utils";

interface Props {
    userId: string;
    communityId: string;
    communityName: string;
    communityImageUrl: string;
    communityBio?: string;
    isCurrentUserAMember: boolean;
    doesRequestExist?: boolean;
}

const CommunityHeader = ({
    userId,
    communityId,
    communityName,
    communityImageUrl,
    communityBio,
    isCurrentUserAMember,
    doesRequestExist,
}: Props) => {

    // Replace hyphens with spaces in communityBio
    const formattedBio = communityBio
        ? communityBio.replace(/-/g, " ")
        : communityName;

    const [isRequestSent, setIsRequestSent] = useState<boolean>(doesRequestExist ?? false);

    async function handleJoinRequest() {
        if (!isCurrentUserAMember) {
            const data = await RequestToJoinCommunity(userId, communityId)
            toast(data.status ? "Request has been sent Successfully" : "Failed to Send Request", {
                description: data.status ? `${formatDateString(data.requestTime)}- Please wait..` : "please try again"
            })
            setIsRequestSent(!!data.status)
        }
    }

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20">
                        <Image
                            src={communityImageUrl}
                            alt="Profile Image"
                            className="rounded-full object-cover shadow-2xl size-4"
                            fill
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">
                            {communityName}
                        </h2>
                    </div>
                </div>
                <Button
                    className="user-card_btn"
                    onClick={handleJoinRequest}
                    disabled={isRequestSent}
                >
                    {isCurrentUserAMember ? (
                        <>
                            <CheckIcon className="size-2" /> Joined
                        </>
                    ) : (
                        isRequestSent ? (
                            <>
                                <LoaderCircle className="size-2 animate-spin contrast-100" />
                                Wait for response
                            </>
                        ) : (
                            <>
                                <CirclePlus className="size-2 " />
                                Request to Join
                            </>
                        )
                    )}
                </Button>

            </div>
            <p className="mt-6 max-w-lg text-base-regular text-light-2">
                {formattedBio}
            </p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
};

export default CommunityHeader;

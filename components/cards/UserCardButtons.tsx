"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../ui/button";
import { useModelContext } from "@/app/Context/ModelContext";
import {
    addUserToCommunity,
    removeUserFromCommunityRequest,
} from "@/lib/actions/community.actions";
import { useAuth } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface UserCardButtonsProps {
    id: string; // Specific card user id (clerk)
    personType?: string;
    adminId?: string; // Admin id (clerk)
}

const UserCardButtons = ({ id, personType, adminId }: UserCardButtonsProps) => {
    const router = useRouter();
    const { setIsOpen } = useModelContext();
    const params = useParams();
    const communityId = params.id as string;
    const { userId } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    let data: any;

    // Function to handle adding the user to the community
    const handleAcceptRequest = async () => {
        setLoading(true);
        data = await addUserToCommunity(communityId, id);
        if (data) {
            toast("User has been Added to Community", {
                description: "The user is now a member of the community.",
            });
        } else {
            toast("Failed to Add User to Community", {
                description: "An error occurred, please try again.",
            });
            setLoading(false);
        }
    };

    // Function to handle rejecting the user's request
    const handleRejectRequest = async () => {
        setLoading(true);
        data = await removeUserFromCommunityRequest(communityId, id);
        if (data) {
            toast("User request removed", {
                description: "The join request has been declined.",
            });
        } else {
            toast("Failed to remove request", {
                description: "An error occurred, please try again.",
            });
        }

        setLoading(false);
    };

    // For Community type, we'll open a modal for removal (existing logic)
    const handleOperation = async () => {
        if (personType === "Community") {
            setIsOpen({
                state: true,
                payload: {
                    userId: id,
                    communityId,
                },
            });
            return;
        }
    };

    return (
        <div className="flex flex-row gap-5 items-center">
            {personType === "Community" &&
                ((userId === adminId && id !== userId) ||
                    (userId !== adminId && id === userId)) && (
                    <Button
                        className="user-card_btn !bg-red-500"
                        onClick={handleOperation}
                        disabled={loading}
                    >
                        Remove
                    </Button>
                )}

            {personType === "Requests" && userId === adminId && (
                <div className="flex flex-row gap-3">
                    <Button
                        className="user-card_btn bg-blue-500 flex items-center gap-2"
                        onClick={handleAcceptRequest}
                        disabled={loading}
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Add</span>
                    </Button>

                    <Button
                        className="user-card_btn bg-gray-500 flex items-center gap-2"
                        onClick={handleRejectRequest}
                        disabled={loading}
                    >
                        <span>Remove</span>
                    </Button>
                </div>
            )}

            <Button
                className="user-card_btn"
                onClick={() => router.push(`/profile/${id}`)}
            >
                View
            </Button>
        </div>
    );
};

export default UserCardButtons;

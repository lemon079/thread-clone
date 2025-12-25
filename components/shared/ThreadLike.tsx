"use client";
import Image from "next/image";
import {
    addLikeToThread,
    removeLikeFromThread,
} from "@/lib/actions/thread.actions";
import { useState, useRef, useCallback } from "react";

interface ThreadLikeProps {
    threadId: string;
    userId: string;
    isLiked: boolean;
    noOfLikes: number;
}

const ThreadLike = ({
    threadId,
    userId,
    isLiked: initialIsLiked,
    noOfLikes: initialNoOfLikes,
}: ThreadLikeProps) => {
    // Local state for optimistic updates
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [noOfLikes, setNoOfLikes] = useState(initialNoOfLikes);
    const [isPending, setIsPending] = useState(false);

    // Track the original server state to know what action to take
    const serverLikedState = useRef(initialIsLiked);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleLike = useCallback(() => {
        // Optimistic update - update UI immediately
        setIsLiked((prev) => !prev);
        setNoOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));

        // Clear any pending debounce
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Debounce the API call - wait 500ms after last click
        debounceTimer.current = setTimeout(async () => {
            const currentLiked = !isLiked; // What the UI shows now

            // Only make API call if state actually changed from server state
            if (currentLiked === serverLikedState.current) {
                return; // No change needed
            }

            setIsPending(true);
            try {
                const result = currentLiked
                    ? await addLikeToThread(userId, threadId)
                    : await removeLikeFromThread(userId, threadId);

                if (result?.success) {
                    // Update server state to match
                    serverLikedState.current = currentLiked;
                } else {
                    // Revert UI to server state on error
                    setIsLiked(serverLikedState.current);
                    setNoOfLikes((prev) =>
                        serverLikedState.current ? prev + 1 : prev - 1
                    );
                }
            } catch (error) {
                console.error("Failed to update likes:", error);
                // Revert UI to server state on error
                setIsLiked(serverLikedState.current);
                setNoOfLikes((prev) =>
                    serverLikedState.current ? prev + 1 : prev - 1
                );
            } finally {
                setIsPending(false);
            }
        }, 500); // 500ms debounce
    }, [isLiked, userId, threadId]);

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={handleLike}
                disabled={isPending}
                className={`transition-transform active:scale-90 ${isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-75"
                    }`}
                aria-label={isLiked ? "Unlike" : "Like"}
            >
                <Image
                    src={`/assets/${isLiked ? "heart-filled.svg" : "heart-gray.svg"}`}
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                />
            </button>
            {noOfLikes > 0 && (
                <p className="text-white text-small-regular ml-1">{noOfLikes}</p>
            )}
        </div>
    );
};

export default ThreadLike;

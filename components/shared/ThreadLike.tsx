'use client';
import Image from 'next/image';
import { addLikeToThread, removeLikeFromThread } from '@/lib/actions/thread.actions';
import { useState } from 'react';

// A generic debounce function in TypeScript.
function debounce<T extends (...args: any[]) => Promise<any> | any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

interface ThreadLikeProps {
    threadId: string;
    userId: string;
    isLiked: boolean;
    noOfLikes: number;
}

const ThreadLike = ({
    threadId,
    userId,
    isLiked,
    noOfLikes,
}: ThreadLikeProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const debouncedRemoveLike = debounce(removeLikeFromThread, 500);
    const debouncedAddLike = debounce(addLikeToThread, 500);

    const handleLike = () => {
        try {
            setIsLoading(true);

            if (isLiked) {
                debouncedRemoveLike(userId, threadId);
            } else {
                debouncedAddLike(userId, threadId);
            }
        } catch (error) {
            console.error('Failed to update likes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            <button
                onClick={handleLike}
                disabled={isLoading}
                className={isLoading ? 'opacity-50 cursor-not-allowed' : "hover:opacity-75"}
            >
                <Image
                    src={`/assets/${isLiked ? 'heart-filled.svg' : 'heart-gray.svg'}`}
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                />
            </button>
            {noOfLikes > 0 && (
                <p className="text-white text-small-regular">{noOfLikes}</p>
            )}
        </div>
    );
};

export default ThreadLike;

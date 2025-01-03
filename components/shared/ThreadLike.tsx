'use client';
import Image from 'next/image';
import { addLikeToThread, removeLikeFromThread } from '@/lib/actions/thread.actions';

const ThreadLike = ({
    threadId,
    userId,
    isLiked,
    noOfLikes
}: {
    threadId: string;
    userId: string;
    isLiked: boolean;
    noOfLikes: number;
}) => {

    const handleLike = async () => {
        try {
            if (isLiked) {
                await removeLikeFromThread(userId, threadId);
            } else {
                await addLikeToThread(userId, threadId);
            }
        } catch (error) {
            console.error('Failed to update likes:', error);
        }
    };

    return (
        <div className='flex items-center'>
            <Image
                src={`/assets/${isLiked ? 'heart-filled.svg' : 'heart-gray.svg'}`}
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-contain hover:contrast-0"
                onClick={handleLike}
            />
            {noOfLikes > 0 && <p className="text-white text-small-regular">{noOfLikes}</p>}
        </div>
    );
};

export default ThreadLike;

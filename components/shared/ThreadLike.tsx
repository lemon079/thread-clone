'use client';

import { useState } from 'react';
import Image from 'next/image';
import { addLikeToThread, removeLikeFromThread } from '@/lib/actions/thread.actions';

const ThreadLike = ({ threadId, userId }: { threadId: string; userId: string }) => {
    threadId = JSON.parse(threadId);

    const [likes, setLikes] = useState<number>(0); // Number of likes
    const [isLiked, setIsLiked] = useState<boolean>(false); // Liked state

    const handleLike = async () => {
       
    };

    return (
        <div>
            <Image
                src={`/assets/${isLiked ? 'heart-filled.svg' : 'heart-gray.svg'}`}
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-contain hover:contrast-0"
                onClick={handleLike}
            />
            {likes > 0 && <span>{likes}</span>}
        </div>
    );
};

export default ThreadLike;

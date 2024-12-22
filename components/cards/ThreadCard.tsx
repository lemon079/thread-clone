import { removeQuotes } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        id: string,
        name: string,
        image: string,
    };
    community: {
        id: string,
        name: string,
        image: string
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;

        }
    }[];
    isComment?: boolean;
}

const ThreadCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: Props) => {

    return (
        <article className={`flex flex-col w-full rounded-xl ${isComment ? "px-0 py-2 xs:px-7" : "p-7 bg-dark-2"}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">

                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${author.id}`} className='relative w-11 h-11'>
                            <Image src={author.image} alt='profile-picture' className='cursor-pointer rounded-full w-full' fill />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor=pointer text-base-semibold text-light-1'>{author.name}</h4>
                        </Link>
                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>
                        <div className='mt-5 flex flex-col gap-3'>
                            <div className='flex gap-3.5'>
                                <Image src={`/assets/heart-gray.svg`} alt='heart' width={24} height={24} className='cursor-pointer object-contain hover:contrast-0' />
                                <Link href={`/thread/${id}`}>
                                    <Image src={`/assets/reply.svg`} alt='reply' width={24} height={24} className='cursor-pointer object-contain hover:contrast-0' />
                                </Link>
                                <Image src={`/assets/repost.svg`} alt='repost' width={24} height={24} className='cursor-pointer object-contain hover:contrast-0' />
                                <Image src={`/assets/share.svg`} alt='share' width={24} height={24} className='cursor-pointer object-contain hover:contrast-0' />
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </article>
    )
}

export default ThreadCard
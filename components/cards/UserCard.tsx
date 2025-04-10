/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Props {
    id: string;
    name: string;
    username: string;
    imageUrl: string;
    personType?: string;
    createdBy?: string;
}

const UserCard = ({ id, name, username, imageUrl, personType, createdBy }: Props) => {
    const router = useRouter();

    return (
        <article className='user-card'>
            <div className='user-card_avatar relative'>
                <Image src={imageUrl} alt='logo' className='rounded-full object-contain' width={60} height={60} />
                <div className="flex-1 text-ellipsis">
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <div className='flex flex-row gap-5'>
                {personType === "Community" && createdBy !== id &&
                    < Button className='user-card_btn !bg-red-500'>
                        Delete
                    </Button>
                }
                <Button className='user-card_btn' onClick={() => router.push(`/profile/${id}`)}>
                    View
                </Button>
            </div>

        </article >
    )
}

export default UserCard
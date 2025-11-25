/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import React from 'react'
import UserCardButtons from './UserCardButtons';

interface Props {
    id: string;
    name: string;
    username: string;
    imageUrl: string;
    personType?: string;
    adminId?: string;
}

const UserCard = async ({ id, name, username, imageUrl, adminId, personType }: Props) => {
    return (
        <article className='user-card'>
            <div className='user-card_avatar relative'>
                <Image src={imageUrl} alt='logo' className='rounded-full object-contain' width={60} height={60} />
                <div className="flex-1 text-ellipsis">
                    <h4 className='text-base-semibold text-light-1'>{name} {id === adminId && <p className='inline ml-2 text-subtle-semibold text-gray-400'>(ADMIN)</p>}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <div className='flex flex-row gap-5 items-center'>
                <UserCardButtons id={id} adminId={adminId} personType={personType} />
            </div>
        </article >
    )
}

export default UserCard
import Image from 'next/image'
import React from 'react'

interface Props {
    accountId: string;
    name: string;
    username: string;
    imageUrl: string;
    bio: string;
}

const ProfileHeader = ({ name, username, imageUrl, bio }: Props) => {

    return (
        <div className='flex w-full flex-col justify-start'>
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20'>
                        <Image src={imageUrl} alt='Profile Image' className='rounded-full object-cover shadow-2xl' fill />
                    </div>
                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>
                {/* TODO: COMMUNITY */}
            </div>

            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>
            <div className='mt-12 h-0.5 w-full bg-dark-3' />
        </div>
    )
}

export default ProfileHeader
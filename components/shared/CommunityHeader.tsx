import Image from 'next/image'
import React from 'react'

interface Props {
    communityId: string;
    CommunityName: string;
    // username: string;
    CommunityImageUrl: string;
    // bio?: string;
}

const CommunityHeader = ({ CommunityName, CommunityImageUrl, communityId }: Props) => {

    return (
        <div className='flex w-full flex-col justify-start'>
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20'>
                        <Image src={CommunityImageUrl} alt='Profile Image' className='rounded-full object-cover shadow-2xl' fill />
                    </div>
                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>{CommunityName}</h2>
                    </div>
                </div>
                {/* TODO: COMMUNITY */}
            </div>
            <p className='mt-6 max-w-lg text-base-regular text-light-2'>Community</p>
            <div className='mt-12 h-0.5 w-full bg-dark-3' />
        </div>
    )
}

export default CommunityHeader
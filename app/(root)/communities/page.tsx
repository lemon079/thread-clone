import CommunityCard from '@/components/cards/CommunityCard';
import { fetchCommunities } from '@/lib/actions/community.actions'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const communities = await fetchCommunities();

    return (
        <>
            <h1 className='head-text'>Communities</h1>
            <section className='mt-9 flex flex-wrap justify-evenly gap-4'>
                {communities.length === 0 ? (
                    <p className='no-result'>No Community</p>
                ) : (
                    communities?.map((community) => (
                        <CommunityCard
                            key={community.id}
                            id={community.id}
                            name={community.name}
                            imgUrl={community.image}
                            bio={community.bio}
                            members={community.members}
                        />
                    ))
                )}
            </section>
        </>
    );
}

export default page
import CommunityCard from '@/components/cards/CommunityCard';
import Pagination from '@/components/shared/Pagination';
import { fetchCommunities } from '@/lib/actions/community.actions'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const page = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const user = currentUser();
    if (!user) return null;

    const { communities, isNext } = await fetchCommunities({
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25
    });

    return (
        <>
            <h1 className='head-text'>Communities</h1>

            <div className='mt-5'>
                {/* <Searchbar routeType='communities' /> */}
            </div>

            <section className='mt-9 flex flex-wrap gap-4'>
                {communities.length === 0 ? (
                    <p className='no-result'>No Community</p>
                ) : (
                    <>
                        {communities?.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </section>

            <Pagination
                path='communities'
                pageNumber={page ? +page : 1}
                isNext={isNext}
            />
        </>
    );
}

export default page
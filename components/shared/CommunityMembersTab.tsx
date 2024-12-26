import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server"
import UserCard from "../cards/UserCard";

const CommunityMembersTab = async ({ communityId }: { communityId: string }) => {
    const user = await currentUser();
    if (!user) return null;

    const communityMembers = await fetchCommunityDetails(communityId);
    console.log("Members: ", communityMembers);
    return (
        <section>
            {
                communityMembers.members.map((member: any) => {
                    return <UserCard
                        id={member.id}
                        name={member.name}
                        username={member.username}
                        imageUrl={member.image}
                    />
                })
            }
        </section>
    )
}

export default CommunityMembersTab
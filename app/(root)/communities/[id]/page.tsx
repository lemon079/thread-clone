import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { PageProps } from "@/app/types/pageProp";
import { communityTabs } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import CommunityHeader from "@/components/shared/CommunityHeader";
import { fetchCommunity } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { UserPopulated } from "@/lib/types";
import DeleteMemberModel from "@/components/ui/DeleteMemberModel";
import { fetchUser } from "@/lib/actions/user.actions";

const page = async ({ params }: PageProps) => {
  const user = await currentUser();
  if (!user) return null;

  const { _id } = await fetchUser(user.id);

  const { id } = await params;

  const communityDetails = await fetchCommunity(id);
  const requests = communityDetails?.requests.map((member: any) => member._id.toString());

  if (!communityDetails) return null;

  const isCurrentUserAMember: UserPopulated = communityDetails.members.find((member: UserPopulated) => member.id === user.id); // for the joining button

  const doesRequestExist = requests.includes(_id.toString()); // for preserving the state of join and waiting for response type shit

  return (
    <section>
      <DeleteMemberModel />
      <CommunityHeader
        communityName={communityDetails.name}
        communityBio={communityDetails.bio}
        communityId={communityDetails.id}
        communityImageUrl={communityDetails.image}
        isCurrentUserAMember={isCurrentUserAMember ? true : false}
        doesRequestExist={doesRequestExist}
        userId={user.id}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map(tab => {
              if (tab.label === "Requests" && user.id !== communityDetails.createdBy.id) return null;

              return (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image src={tab.icon} alt={tab.label} width={24} height={24} sizes="24" className="object-cover" />
                  <p className="max-sm:hidden">{tab.label}</p>
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {tab.label === "Threads"
                      ? communityDetails?.threads?.length
                      : tab.label === "Members"
                        ? communityDetails?.members?.length
                        : communityDetails?.requests?.length}
                  </p>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="threads" className="text-light-1 w-full">
            <ThreadsTab
              currentUser={id}
              accountType="Community"
              id={communityDetails._id}
            />
          </TabsContent>

          <TabsContent value="members">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members.map((member: UserPopulated) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.id === user.id ? "You" : member.name}
                  username={member.username}
                  imageUrl={member.image}
                  adminId={communityDetails.createdBy.id}
                  personType="Community"
                />
              ))}
            </section>
          </TabsContent>
          {
            user.id === communityDetails.createdBy.id &&
            <TabsContent value="requests">
              <section className="mt-9 flex flex-col gap-10">
                {
                  communityDetails.requests.length === 0 ? <p className="no-result">No Requests</p> : communityDetails.requests.map((member: any) => (
                    <UserCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imageUrl={member.image}
                      adminId={communityDetails.createdBy.id}
                      personType="Requests"
                    />
                  ))
                }
              </section>
            </TabsContent>
          }
        </Tabs>
      </div>
    </section>
  )
}

export default page
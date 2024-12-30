import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { PageProps } from "@/app/types/pageProp";
import { communityTabs } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import CommunityHeader from "@/components/shared/CommunityHeader";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";


const page = async ({ params }: PageProps) => {
  const user = await currentUser();
  if (!user) return null;
  const { id } = await params;

  const communityDetails = await fetchCommunityDetails(id);
  let requests: any = [];

  return (
    <section>
      <CommunityHeader
        communityName={communityDetails.name}
        communityBio={communityDetails.bio}
        communityId={communityDetails.id}
        communityImageUrl={communityDetails.image}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map(tab => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-cover" />
                <p className="max-sm:hidden">{tab.label}</p>
                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                  {tab.label === "Threads" ? communityDetails?.threads?.length : tab.label === "Members" ? communityDetails?.members?.length : requests?.length}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="text-light-1 w-full">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imageUrl={member.image}
                  personType="Community" />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType=""
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default page
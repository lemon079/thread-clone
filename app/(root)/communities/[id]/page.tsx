import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { PageProps } from "@/app/types/pageProp";
import { communityTabs } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import CommunityHeader from "@/components/shared/CommunityHeader";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import CommunityMembersTab from "@/components/shared/CommunityMembersTab";


const page = async ({ params }: PageProps) => {
  const user = await currentUser();
  if (!user) return null;
  const { id } = await params;
  const community = await fetchCommunityDetails(id);

  return (
    <section>
      <CommunityHeader
        communityName={community.name}
        communityBio={community.bio}
        communityId={community.id}
        communityImageUrl={community.image}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map(tab => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-cover" />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{community.threads?.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="mt-9 w-full">
            {community.threads.map((communityThread: any) => (
              < ThreadCard
                key={communityThread._id} // not passing community prop as we already fetching specific community's threads
                id={communityThread._id}
                parentId={communityThread.parentId}
                content={communityThread.text}
                author={communityThread.author}
                createdAt={communityThread.createdAt}
                comments={communityThread.children}
              />
            ))}
          </TabsContent>
          <TabsContent value="members">
            <CommunityMembersTab communityId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default page
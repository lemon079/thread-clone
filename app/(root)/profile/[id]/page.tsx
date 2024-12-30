import { PageProps } from "@/app/types/pageProp";
import ThreadCard from "@/components/cards/ThreadCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchThreadsReplies } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";
import { redirect } from "next/navigation";


const page = async ({ params }: PageProps) => {
    const { id } = await params;
    if (!id) return null;

    const user = await currentUser();
    const userInfo = await fetchUser(id);
    if (!userInfo.onboarded) redirect('/onboarding');

    let replies: any;

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user?.id || ""}
                name={userInfo.name}
                username={userInfo.username}
                imageUrl={userInfo.image}
                bio={userInfo.bio}
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map(tab => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-cover" />
                                <p className="max-sm:hidden">{tab.label}</p>
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {tab.label === "Threads" ? userInfo?.threads?.length : tab.label === "Replies" ? replies?.length : ""}
                                </p>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="threads" className="w-full text-light-1">
                        <ThreadsTab
                            currentUserId={user?.id || ""}
                            accountId={userInfo.id}
                            accountType="User"
                        />
                    </TabsContent>
                    {/* <TabsContent value="replies" className="w-full text-light-1">

                    </TabsContent>
                    <TabsContent value="tagged" className="w-full text-light-1">
                    </TabsContent> */}
                </Tabs>
            </div>
        </section>
    )
}

export default page
/* eslint-disable */
import { PageProps } from "@/app/types/pageProp";
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: PageProps) => {
    const { id } = await params;
    if (!id) return null;

    const user = await currentUser();
    if (!user) return null;
    const thread = await fetchThreadById(id);
    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect("/onboarding");

    return (
        <>
            <section className="relative">
                <div>
                    <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        currentUserId={user?.id || ""}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={thread.author}
                        community={thread.community}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                        view="singleThread"
                        noOfLikes={thread.likes.length}
                        isLiked={thread.likes.includes(userInfo._id) || false}
                    />
                </div>

                <div className="mt-7">
                    <Comment
                        threadId={thread.id}
                        currentUserImage={userInfo?.image}
                        currentUserId={JSON.stringify(userInfo._id)}
                    />
                </div>

                {/* fetching comments of a thread that we see at the moment */}
                <div className="mt-10">
                    {thread && thread.children.map((commentThread: any) => {
                        return <ThreadCard
                            key={commentThread._id}
                            id={commentThread._id}
                            currentUserId={user?.id || ""}
                            parentId={commentThread.parentId}
                            content={commentThread.text}
                            author={commentThread.author}
                            community={commentThread.community}
                            createdAt={commentThread.createdAt}
                            comments={commentThread.children}
                            isComment
                            noOfLikes={commentThread.likes.length}
                            isLiked={commentThread.likes.includes(userInfo._id) || false}
                        />
                    })}
                </div>
            </section>
        </>
    );
};

export default page;

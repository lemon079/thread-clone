import { fetchUserThreads } from "@/lib/actions/thread.actions";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    const user = await fetchUserThreads(currentUserId);

    return (
        <section className="mt-9 flex flex-col gap-10">
            {user.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User"
                            ? { name: user.name, image: user.image, id: user.id }
                            : {
                                name: thread.author.name,
                                image: thread.author.image,
                                id: thread.author.id,
                            }
                    }
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
};

export default ThreadsTab;

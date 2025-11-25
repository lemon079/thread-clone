import { redirect } from "next/navigation";

import { fetchCommunityThreads } from "@/lib/actions/community.actions";
import { fetchUserThreads } from "@/lib/actions/thread.actions";

import ThreadCard from "../cards/ThreadCard";
import { ThreadType } from "@/lib/types";
import { Types } from "mongoose";

interface Props {
    currentUser: string;
    accountType: "User" | "Community";
    id: Types.ObjectId
}

async function ThreadsTab({ id, currentUser, accountType }: Props) {

    let result;
    if (accountType === "Community") {
        result = await fetchCommunityThreads(id);
    } else {
        result = await fetchUserThreads(id);
    }

    if (!result) {
        redirect("/");
    }

    return (
        <section className='flex flex-col gap-10'>
            {result.length > 0 ? result.map((thread: ThreadType) => (
                <ThreadCard
                    key={(thread._id)?.toString()}
                    _id={thread._id}
                    userId={currentUser}
                    parentId={thread.parentId}
                    text={thread.text}
                    author={thread.author}
                    children={thread.children}
                    community={thread?.community}
                    createdAt={thread.createdAt}
                    comments={thread.children || []}
                    noOfLikes={(thread.likes ?? []).length}
                    isLiked={(thread.likes ?? []).includes(thread.author._id)}
                />
            )) : <p className="no-result mt-10">No Threads</p>}
        </section>
    );
}

export default ThreadsTab;
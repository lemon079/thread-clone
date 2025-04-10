import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";

import { fetchThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { ThreadType } from "@/lib/types";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const { threads, }: any = await fetchThread();

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {threads.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {threads.map((thread: ThreadType) => {
              return (
                <ThreadCard
                  userId={user.id}
                  key={(thread._id)?.toString()}
                  _id={thread._id}
                  parentId={thread.parentId}
                  text={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children || []}
                  noOfLikes={(thread.likes ?? []).length}
                  isLiked={(thread.likes ?? []).includes(userInfo._id)}
                />
              );
            })}
          </>
        )}
      </section>
    </>
  );
}

export default Home;
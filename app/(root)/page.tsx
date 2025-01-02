import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";

import { fetchThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { threads, isNext }: any = await fetchThread(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {threads.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {threads.map((thread: any) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext}
      />
    </>
  );
}

export default Home;
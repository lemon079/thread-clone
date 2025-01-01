import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const result = await fetchThread(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.threads.length === 0 ?
          <p className="no-result">No Thread Found</p>
          :
          result?.threads.map((thread) => (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              // currentUserId={user?.id || ""} // passed "" so that it is always gonna be string
              parentId={thread.parentId}
              content={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
              view="allThreads"
            />
          ))
        }
      </section>
    </>
  );
}

import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const activity: any = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className='head-text mb-10'>Activity</h1>
      <section>
        {activity?.length > 0 ? (
          activity?.map((activity: any) => (

            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
              <article className='activity-card my-3' >
                <Image src={activity.author.image} alt='profile picture' width={20} height={20} className='rounded-full object-cover' />
                <p className='!text-small-regular text-light-1'>
                  <span className='mr-1 text-primary-500'>{activity.author.name}</span>{" "}
                  Replied to your thread
                </p>
              </article>
            </Link>
          ))
        ) : <p className='!text-base-regular text-light-3'>No Activity yet</p>}
      </section>
    </section>
  )

}

export default page
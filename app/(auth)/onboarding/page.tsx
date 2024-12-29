import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const page = async () => {
  const user = await currentUser();

  const userInfo = await fetchUser(user.id);
  if(!userInfo.onboarded) redirect('/onboarding');

  const userData = {
    id: user?.id,
    name: user?.fullName || userInfo?.name || '',
    username: user?.username || user?.username || '',
    image: user?.imageUrl || userInfo?.image || '',
    bio: userInfo?.bio || '',
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>Complete your profile now to use Threads</p>
      <section className='mt-9 p-10 bg-dark-2'>
        <AccountProfile user={userData} />
      </section>
    </main>
  )
}

export default page
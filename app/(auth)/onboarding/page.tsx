import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const page = async () => {
  const user = await currentUser();
  let userInfo: any;
  if (user) {
    userInfo = await fetchUser(user.id);
    // You can now safely use userInfo
  } else {
    // Handle the case where user is null (e.g., show an error or redirect)
    console.error('No user found');
  }

  if (!userInfo?.onboarded) redirect('/onboarding')

  const userData: any = {
    id: user?.id,
    name: user?.fullName || userInfo.name,
    username: user?.username || userInfo.username,
    image: user?.imageUrl || userInfo.image,
    bio: userInfo.bio || '',
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
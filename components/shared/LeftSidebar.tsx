"use client"
import React from 'react'
import { sidebarLinks } from '@/constants'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs';

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {

          const route = link.route === '/profile' && userId
            ? `${link.route}/${userId}`
            : link.route;

          const isActive = (pathname.includes(route) && route.length > 1) || pathname === route;

          return (
            <Link
              key={link.label}
              href={route}
              className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className='mt-10 p-6'>
        <SignedIn>
          <SignOutButton>
            <div className='flex cursor-pointer gap-4 px-4'>
              <Image src={"/assets/logout.svg"} alt='logout' width={24} height={24} />
              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar;

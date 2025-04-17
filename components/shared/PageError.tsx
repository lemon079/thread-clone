"use client"
import { Button } from '@/components/ui/button'
import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const error = () => {
    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center gap-y-4'>
            <TriangleAlertIcon className='size-6' />
            <p className='text-sm'>Something Went Wrong</p>
            <Button asChild variant={"secondary"} size={"lg"} className='font-bold'>
                <Link href={"/"}>
                    Back To Home
                </Link>
            </Button>
        </div>
    )
}

export default error
"use client"
import { CommentValidation } from '@/lib/validations/thread';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { z } from 'zod';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form"
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';
import { usePathname } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';

interface Props {
    threadId: string,
    currentUserImage: string,
    currentUserId: string
}

const Comment = ({ threadId, currentUserId, currentUserImage }: Props) => {

    const path = usePathname();
    const { organization } = useOrganization();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        const threadObject = {
            commentText: values.thread,
            userId: currentUserId,
            threadId: threadId,
            communityId: organization ? organization.id : null,
            path
        }
        await addCommentToThread(threadObject);
        form.reset();
    }

    return (
        <>
            <Form {...form}>
                <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='thread'
                        render={({ field }) => (
                            <FormItem className='flex w-full items-center gap-3'>
                                <FormLabel>
                                    <Image
                                        src={currentUserImage}
                                        alt='current_user'
                                        width={48}
                                        height={48}
                                        className='rounded-full object-cover'
                                    />
                                </FormLabel>
                                <FormControl className='border-none bg-transparent'>
                                    <Input
                                        type='text'
                                        {...field}
                                        placeholder='Comment...'
                                        className='no-focus text-light-1 outline-none'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='comment-form_btn'>
                        Reply
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default Comment
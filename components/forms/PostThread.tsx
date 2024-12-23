"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { usePathname } from "next/navigation"
import { ThreadValidation } from "@/lib/validations/thread"
import { Button } from '@/components/ui/button'
import { createThread } from "@/lib/actions/thread.actions"
import { useRouter } from "next/navigation"
import { useOrganization } from "@clerk/nextjs"


const PostThread = ({ userId }: { userId: string }) => {
    // this userId is from db ObjectId ( _id) not a clerk id   

    const pathname = usePathname(); // returns the current path
    const router = useRouter();
    const { organization } = useOrganization();

    const form = useForm<z.infer<typeof ThreadValidation>>({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        },
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname
        });

        // router.push('/');
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">

                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-3 w-full">
                                <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
                                <FormControl className="flex-1 text-base-semibold text-gray-200">
                                    <Textarea
                                        className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                                        rows={15}
                                        {...field} // destructure all other props like value, onChange func, onBlur, etc..
                                    />
                                </FormControl>
                                <FormMessage />
                                <Button type="submit" className="bg-primary-500 text-white">Post Thread</Button>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    )
}

export default PostThread
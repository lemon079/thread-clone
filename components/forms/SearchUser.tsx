"use client"
import UserCard from "@/components/cards/UserCard";
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { SearchValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

const page = ({ userId }: { userId: string }) => {

    const form = useForm({
        resolver: zodResolver(SearchValidation),
        defaultValues: {
            searchString: "",
        }
    });
    const [users, setUsers] = useState<{ id: string, name: string, username: string, image: string, personType: string }[]>([]);

    const onSubmit = async (values: z.infer<typeof SearchValidation>) => {
        // Fetching Users
        const { users } = await fetchUsers({
            userId: userId,
            searchString: values.searchString,
            pageNumber: 1,
            pageSize: 20,
            sortBy: "desc",
        });
        setUsers(() => [...users]);
        // TODO: FIX SEARCHING ERROR - plain object
    };


    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-5">
                    <FormItem className="flex-1">
                        <FormField
                            control={form.control}
                            name="searchString"
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        {...field}
                                        className="py-2 text-base-medium text-gray-200 outline-0 border-dark-4 focus-within:border-gray-1"
                                    />
                                </FormControl>
                            )}
                        />
                    </FormItem>
                    <Button type="submit" className='user-card_btn'>Search</Button>
                </form>
            </Form>

            <div className="mt-14 flex flex-col gap-9">
                {users.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    users.map((user) => (
                        <UserCard
                            key={user.id}
                            id={user.id}
                            name={user.name}
                            username={user.username}
                            imageUrl={user.image}
                            personType='User'
                        />
                    ))
                )}
            </div>
        </section >
    );
};

export default page;

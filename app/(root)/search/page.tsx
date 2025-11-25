import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import SearchUser from "@/components/forms/SearchUser";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect("/onboarding");

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <SearchUser userId={user.id} />
        </section>
    );
};

export default Page;

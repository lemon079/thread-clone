import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { fetchCommunities } from "@/lib/actions/community.actions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const RightSidebar = async () => {
  const user = await currentUser();
  if (!user) return null;

  const { users } = await fetchUsers({ userId: user.id });
  const communities = await fetchCommunities();

  return (
    <section className="custom-scrollbar rightsidebar">
      <h3 className="text-heading4-medium text-light-1">
        Suggested Communities
      </h3>
      {communities && communities.length > 0 ? (
        <div className="flex flex-1 flex-col justify-start">
          <div className="flex flex-col gap-y-4 mt-5">
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="relative flex flex-wrap gap-x-3">
                  <Image
                    src={community.image}
                    alt="community_logo"
                    className="rounded-full object-cover"
                    width={24}
                    height={24}
                  />
                  <h4 className="text-base-semibold text-light-1">
                    {community.name}
                  </h4>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="community-card_btn ml-auto"
                >
                  <Link href={`/communities/${community.id}`}>View</Link>
                </Button>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-result">No result</p>
      )}

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-neutral-200">
          Suggested Users
        </h3>
        <div className="flex flex-col gap-y-4 mt-5">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center gap-3 p-2"
              >
                <div className="flex items-center gap-x-3">
                  <Image
                    src={user.image}
                    alt={`${user.name} profile`}
                    className="rounded-full object-cover"
                    width={36}
                    height={36}
                  />
                  <div>
                    <h4 className="text-base-semibold font-semibold text-neutral-200">
                      {user.name}
                    </h4>
                    <p className="text-small-medium text-gray-500">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" className="user-card_btn p-2 ml-auto">
                  <Link href={`/profile/${user.id}`}>View</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="no-result">No result</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;

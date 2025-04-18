import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { CommunityPopulated } from "@/lib/types";

interface Props {
    key: string;
    id: string;
    name: string;
    imgUrl: string;
    bio: string;
    members: CommunityPopulated[];
}

const CommunityCard = ({
    id,
    name,
    imgUrl,
    bio,
    members,
}: Props) => {


    return (
        <article className="community-card">
            <div className="flex flex-wrap items-center gap-3">
                <Link href={`/communities/${id}`} className="relative h-12 w-12">
                    <Image
                        src={imgUrl}
                        alt="community_logo"
                        fill
                        className="rounded-full object-cover"
                    />
                </Link>

                <div>
                    <Link href={`/communities/${id}`}>
                        <h4 className="text-base-semibold text-light-1">{name}</h4>
                    </Link>
                </div>
            </div>

            <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-x-2">
                    <Link href={`/communities/${id}`}>
                        <Button size="sm" className="community-card_btn" title="View">
                            <Search />
                        </Button>
                    </Link>
                </div>

                {members.length > 0 && (
                    <div className="flex items-center">
                        {members.map((member, index) => (
                            <Image
                                key={index}
                                src={member.image}
                                alt={`user_${index}`}
                                width={28}
                                height={28}
                                className={`${index !== 0 && "-ml-2"} rounded-full object-cover`}
                            />
                        ))}
                        {members.length > 3 && (
                            <p className="ml-1 text-subtle-medium text-gray-1">
                                {members.length}+ Users
                            </p>
                        )}
                    </div>
                )}
            </div>
        </article >
    );
};

export default CommunityCard;

/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import Link from "next/link";
import ThreadLike from "../shared/ThreadLike";
import { formatDateString } from "@/lib/utils";
import { ThreadType } from "@/lib/types";

export interface Props extends ThreadType {
    userId?: string;
    isComment?: boolean;
    comments: ThreadType[];
    view?: "allThreads" | "singleThread";
    isLiked: boolean;
    noOfLikes: number;
}

const ThreadCard = async ({
    _id,
    userId,
    text,
    author,
    community,
    createdAt,
    comments,
    isComment,
    view,
    isLiked,
    noOfLikes,
}: Props) => {
    return (
        <article
            className={`flex flex-col w-full rounded-xl ${isComment ? "px-0 py-2 my-10 xs:px-7" : "p-7 bg-dark-2"
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative w-11 h-11">
                            <Image
                                src={author.image}
                                alt="profile-picture"
                                className="cursor-pointer rounded-full w-full"
                                fill
                            />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor=pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>
                        <p className="mt-2 text-small-regular text-light-2">{text}</p>
                        <div className="mt-5 flex flex-col gap-3">
                            <div className="flex gap-3.5">
                                <ThreadLike
                                    threadId={_id?.toString() || ""}
                                    userId={userId || ""}
                                    isLiked={isLiked}
                                    noOfLikes={noOfLikes}
                                />
                                <Link href={`/thread/${_id}`}>
                                    <Image
                                        src={`/assets/reply.svg`}
                                        alt="reply"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain hover:contrast-0"
                                    />
                                </Link>
                                <Image
                                    src={`/assets/repost.svg`}
                                    alt="repost"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain hover:contrast-0"
                                />
                                <Image
                                    src={`/assets/share.svg`}
                                    alt="share"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain hover:contrast-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isComment && comments.length > 0 && view === "allThreads" && (
                <div className="ml-1 mt-3 flex items-center gap-2">
                    {comments.slice(0, 2).map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt={`user_${index}`}
                            width={24}
                            height={24}
                            className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                        />
                    ))}

                    <Link href={`/thread/${_id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                        </p>
                    </Link>
                </div>
            )}

            <div className="flex gap-x-2">

                <p className="mt-5 text-subtle-medium text-gray-1">
                    {formatDateString(createdAt)}
                </p>
                {!isComment && community && (
                    <Link
                        href={`/communities/${community.id}`}
                        className="mt-5 flex items-center relative"
                    >
                        <p className="text-subtle-medium text-gray-1">
                            - {community.name} Community
                        </p>
                        <Image
                            src={community.image}
                            alt={community.name}
                            width={14}
                            height={14}
                            className="ml-1 rounded-full object-cover"
                        />
                    </Link>
                )}
            </div>

        </article>
    );
};

export default ThreadCard;

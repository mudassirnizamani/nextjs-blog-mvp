"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Icon from "../Icon";
import { TPost } from "@/lib/types";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setProgress } from "@/redux/commonSlice";
import { useQueryClient } from "@tanstack/react-query";
import Blocks from "editorjs-blocks-react-renderer";

const PostCard = ({ post }: { post: TPost }) => {
  const dispatch = useAppDispatch();

  const { authStatus, user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  async function handleSaveLetterPost(postID: string) {
    try {
      dispatch(setProgress(70));
      const { data } = await axios.post("/api/posts/saved", { postID });
      queryClient.invalidateQueries(["posts", "saved"]);
      dispatch(setProgress(100));
      toast.success(data.message);
    } catch (error: any) {
      dispatch(setProgress(100));
      toast.error(error.message);
      console.log(error);
    }
  }
  console.log(post.content.blocks)

  return (
    <article className="mb-2">
      <Card shadow="none" radius="sm" className="border">
        {/* <CardHeader>
          <User
            as={Link}
            href={post.author.username}
            name={post.author.name}
            description={"@" + post.author.username}
            avatarProps={{
              src: `${post.author.avatar}`,
            }}
          />
        </CardHeader> */}
        <CardBody className="py-0">
          <div className="flex items-center">
            <div className="flex-[2]">
              <h3 className="text-2xl font-bold mb-4">
                <Link
                  href={`/${post.author.username}/${post.path}`}
                  className="hover:text-primary"
                >
                  {post.title}
                </Link>
              </h3>
              {post.image !== null && (
                <figure className="flex-1 w-full h-[25rem]">
                  <Image
                    src={post.image}
                    width={200}
                    height={200}
                    alt="about image"
                    className="rounded-md object-cover w-full h-full aspect-[4/2]"
                  />
                </figure>
              )}
              <div className="prose mt-4">
                <Blocks
                  data={post.content}
                  renderers={{
                    checkList: Checklist,
                  }}
                />
              </div>

              { /*
              <div className="pt-2">
                <Button size="sm" variant="light">
                  #Javascript
                </Button>
                <Button size="sm" variant="light">
                  #React.js
                </Button>
                <Button size="sm" variant="light">
                  #Next.js
                </Button>
                <Button size="sm" variant="light">
                  #Typescript
                </Button>
              </div>
                          */ }

            </div>
          </div>
        </CardBody>
        <CardFooter className="justify-between">
          <div className="flex items-center gap-4">
            {/* <div>5 Reacts</div> */}
            <Button
              className="flex items-center gap-2"
              variant="light"
              as={Link}
              href={`/${post.author.username}/${post.path}#comments`}
            >
              <Icon name="message-circle" strokeWidth={1.25} />
              <span>
                {/*{post._count.comments}{" "}*/}
                <span className="max-sm:hidden transpa">Comments</span>
              </span>
            </Button>
          </div>
          <div>
            <Button
              variant="light"
              isIconOnly
              onPress={() => handleSaveLetterPost(post.id)}
              isDisabled={!authStatus ? true : false}
            >
              {/*<Icon
                name="bookmark"
                strokeWidth={1.25}
                className={`${post.saved.some((id) => id.userId === user?.id) &&
                  post.saved.some((id) => id.postId === post.id)
                  ? "fill-black"
                  : "fill-none"
                  }`}
              /> */ }
            </Button>
          </div>
        </CardFooter>
      </Card>
    </article>
  );
};


const Checklist = ({ data, className = "my-2" }: any) => {
  return (
    <>
      {data?.items.slice(0, 1).map((item: any, i: any) => (
        <p key={i} className={className}>
          <label>
            <input type="checkbox" checked={item.checked} /> {item.text.replace("<br>", " ")}
          </label>
        </p>
      ))}
    </>
  );
};

export default PostCard;

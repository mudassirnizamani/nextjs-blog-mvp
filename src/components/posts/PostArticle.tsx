"use client";

import { TPost } from "@/lib/types";

import { Button, ButtonGroup, User, useDisclosure } from "@nextui-org/react";

import Link from "next/link";

import Image from "next/image";
import React from "react";

import Blocks from "editorjs-blocks-react-renderer";
import moment from "moment";
import { useAppSelector } from "@/hooks/reduxHooks";
import DeletePostModal from "./DeletePostModal";
import { useRouter } from "next/navigation";
import Script from "next/script";

const PostArticle = ({ post }: { post: TPost }) => {
  const router = useRouter();

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const { user } = useAppSelector((state) => state.auth);

  console.log(post.content.blocks)
  return (
    <>
      <div className="pb-4 w-[99%] md:w-[50%] mx-auto mt-[2rem]">
        <header>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : '16be8fd4eab8b3d227f91f56f4a6eb8e',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                  };
                  document.write('<scr' + 'ipt src="https://www.adsterra.com/codes/'+atOptions.key+'/min.js" type="text/javascript"></scr' + 'ipt>');
                </script>
                <script type="text/javascript" src="//www.topcreativeformat.com/16be8fd4eab8b3d227f91f56f4a6eb8e/invoke.js"></script>
              `,
            }}
          />

          <Script type="text/javascript" src="//www.topcreativeformat.com/16be8fd4eab8b3d227f91f56f4a6eb8e/invoke.js"></Script>

          <h1 className="mb-6 mt-4 scroll-m-20 lg:text-5xl md:text-4xl text-3xl sm:font-extrabold font-bold tracking-tight">
            {post.title}
          </h1>
          <div className="flex justify-between items-center mb-5">
            <User
              name={post.author.name}
              as={Link}
              href={`/${post.author.username}`}
              description={
                <div className="text-default-500">
                  Posted on: (
                  {moment(post.createdAt, moment.ISO_8601).format("DD MMM")} ){" "}
                  {moment(
                    post.createdAt,
                    moment.ISO_8601,
                    "DDMMMYYYY"
                  ).fromNow()}
                </div>
              }
              avatarProps={{
                src: `${post.author.avatar}`,
              }}
              className=""
            />
            {user && user.id === post.author.id ? (
              <ButtonGroup radius="sm">
                <Button
                  className=""
                  size="sm"
                  onPress={() =>
                    router.push(`/${post.author.username}/${post.path}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button color="danger" size="sm" onClick={onOpen}>
                  Delete
                </Button>
              </ButtonGroup>
            ) : null}
          </div>
          {post.image !== null && (
            <figure className="w-full max-h-[25rem] mb-4">
              <Image
                src={post.image}
                width={300}
                height={200}
                className="w-full h-full object-cover max-h-[350px] md:aspect-[5/2] rounded-md aspect-[2/2]"
                // className="rounded-md object-cover w-full h-full aspect-[4/2]"
                alt={post.title}
              />
            </figure>
          )}
        </header>
        <div className="prose mt-[2rem]">
          <Blocks
            data={post.content}
            renderers={{
              checkList: Checklist,
            }}
          />
        </div>
      </div>
      <hr className="pb-8" />
      {/* 
        TODO: Change this
      <Comments post={post} />
      */}

      {/* ===DELETE MODAL=== */}
      <DeletePostModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        post={post}
        type="single post"
      />
    </>
  );
};

export default PostArticle;

const Checklist = ({ data, className = "my-2" }: any) => {
  return (
    <>
      {data?.items.map((item: any, i: any) => (
        <p key={i} className={className}>
          <label>
            <input type="checkbox" checked={item.checked} /> {item.text}
          </label>
        </p>
      ))}
    </>
  );
};

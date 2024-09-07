import { parseMetadataFile } from "@/metadata/metadata_parser";
import type { Metadata } from "next";

type Props = {
  params: { postId: string, userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = `${params.userId}/${params.postId}`;

  const metadata = parseMetadataFile('/home/mujheri/code/mujheri/nextjs-blog-mvp/metadata.json');
  console.log(metadata[id]);

  return {
    title: metadata[id].title,
    description: metadata[id].description,
    openGraph: {
      images: metadata[id].image,
      title: metadata[id].title,
      description: metadata[id].description,
      type: "article",
      url: `https://madeafamily.com/${id}`
    },
    twitter: {
      images: metadata[id].image,
      title: metadata[id].title,
      description: metadata[id].description,
    }
  };
}

const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PostLayout;

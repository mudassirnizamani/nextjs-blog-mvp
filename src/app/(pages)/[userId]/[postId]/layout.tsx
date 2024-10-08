import { JsonMetadata, parseMetadataFile } from "@/metadata/metadata_parser";
import type { Metadata } from "next";

type Props = {
  params: { postId: string, userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = decodeURIComponent(`${params.userId}/${params.postId}`);

  console.log(id)

  let metadata: JsonMetadata = {}
  try {
    metadata = parseMetadataFile();
  } catch (e) {
    console.log("error occurred while parsing the file")
  }

  console.log(metadata)
  console.log(metadata[id])
  return {
    title: metadata[id]?.title ?? "",
    description: metadata[id]?.description ?? "",
    openGraph: {
      images: metadata[id]?.image ?? "",
      title: metadata[id]?.title ?? "",
      description: metadata[id]?.description ?? "",
      type: "article",
      url: `https://madeafamily.com/`
    },
    twitter: {
      images: metadata[id]?.image ?? "",
      title: metadata[id]?.title ?? "",
      description: metadata[id]?.description ?? "",
    }
  };
}


const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return <>
    {children}</>;
};

export default PostLayout;

import { parseMetadataFile } from "@/metadata/metadata_parser";
import type { Metadata } from "next";
import path from "path";

type Props = {
  params: { postId: string, userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // const id = `${params.userId}/${params.postId}`;
  //
  //
  console.log("parsin metadatajson")

  try {
    const metadataPath = path.join(process.cwd(), 'public', 'metadata.json');
    const metadataFrom = parseMetadataFile(metadataPath);
    console.log(metadataFrom);
  } catch (e) {
    console.log("error occurred while parsing the file")
  }
  const metadata = {
    "title": "Post for ubaid",
    "description": "This is a blog from MadeaFamily",
    "image": "https://res.cloudinary.com/mudassir-nizamani/image/upload/v1725529947/blog/articles/dbzwzvik3tbvg0b6wbtj.png"
  }

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      images: metadata.image,
      title: metadata.title,
      description: metadata.description,
      type: "article",
      url: `https://madeafamily.com/`
    },
    twitter: {
      images: metadata.image,
      title: metadata.title,
      description: metadata.description,
    }
  };
}


const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PostLayout;

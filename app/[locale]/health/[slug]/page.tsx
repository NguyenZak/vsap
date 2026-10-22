import { PostPage, postMetadata, type PostParams } from "@/components/PostPage";

type Props = { params: PostParams };

// Posts come from the CMS, so any slug published there gets a page.
export const dynamicParams = true;

export const generateMetadata = ({ params }: Props) => postMetadata(params);

export default function HealthPostPage({ params }: Props) {
  return <PostPage params={params} channel="health" />;
}

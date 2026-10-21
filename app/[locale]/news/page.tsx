import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("news", params);

export default function NewsPage({ params }: Props) {
  return <CmsPage id="news" params={params} />;
}

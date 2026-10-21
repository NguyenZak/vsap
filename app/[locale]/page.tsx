import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("home", params);

export default function HomePage({ params }: Props) {
  return <CmsPage id="home" params={params} />;
}

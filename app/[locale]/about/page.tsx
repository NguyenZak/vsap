import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("about", params);

export default function AboutPage({ params }: Props) {
  return <CmsPage id="about" params={params} />;
}

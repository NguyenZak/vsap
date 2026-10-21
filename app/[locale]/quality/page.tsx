import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("quality", params);

export default function QualityPage({ params }: Props) {
  return <CmsPage id="quality" params={params} />;
}

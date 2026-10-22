import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("health", params);

export default function HealthPage({ params }: Props) {
  return <CmsPage id="health" params={params} />;
}

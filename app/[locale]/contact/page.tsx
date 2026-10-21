import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("contact", params);

export default function ContactPage({ params }: Props) {
  return <CmsPage id="contact" params={params} />;
}

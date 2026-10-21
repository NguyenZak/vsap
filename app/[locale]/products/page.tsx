import { CmsPage, cmsMetadata } from "@/components/cms/CmsPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => cmsMetadata("products", params);

export default function ProductsPage({ params }: Props) {
  return <CmsPage id="products" params={params} />;
}

import { getPortfolioData } from "@/lib/portfolio/getPortfolioData";
import EditPortfolioComponent from "./EditPortfolioForm";

export default async function Page({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  const { "portfolio-slug": slug } = await params;
  const portfolio = getPortfolioData(slug);

  return <EditPortfolioComponent portfolio={portfolio} />;
}

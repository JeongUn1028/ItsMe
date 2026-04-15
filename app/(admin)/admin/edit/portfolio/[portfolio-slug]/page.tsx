import EditPortfolioComponent from "./EditPortfolioForm";
import { getPortfolios } from "@/lib/portfolio/getPortfolios";

export async function generateStaticParams() {
  const portfolios = getPortfolios();
  return portfolios.map((portfolio) => ({
    "portfolio-slug": portfolio.slug,
  }));
}

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  return <EditPortfolioComponent params={params} />;
}

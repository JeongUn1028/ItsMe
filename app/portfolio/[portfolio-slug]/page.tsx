import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import { PortfolioContent } from "./portfolio-content";

export async function generateStaticParams() {
  const portfolios = getPortfolios();
  return portfolios.map((portfolio) => ({
    "portfolio-slug": portfolio.slug,
  }));
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  return <PortfolioContent params={params} />;
}

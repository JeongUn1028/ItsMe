import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import { PortfolioContent } from "../../components/portfolio/portfolio-slug/portfolio-content";
import { use } from "react";
export async function generateStaticParams() {
  const portfolios = getPortfolios();
  return portfolios.map((portfolio) => ({
    "portfolio-slug": portfolio.slug,
  }));
}

export default function PortfolioPage({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  use(params);
  return <PortfolioContent params={params} />;
}

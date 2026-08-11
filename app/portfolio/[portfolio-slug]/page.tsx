import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import { PortfolioContent } from "../../components/portfolio/portfolio-slug/portfolio-content";

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
  const resolvedParams = await params; // params를 resolve합니다.
  return <PortfolioContent params={resolvedParams} />;
}

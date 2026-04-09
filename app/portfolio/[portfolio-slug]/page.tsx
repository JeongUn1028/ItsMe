import { PortfolioContent } from "./portfolio-content";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  return <PortfolioContent params={params} />;
}

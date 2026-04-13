import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import PortfolioCard from "./portfolio-card/portfolio-card";

export default function PortfolioCards() {
  const portfolios = getPortfolios().filter(
    (portfolio) => portfolio.status === "published",
  );
  return (
    <>
      {portfolios.map((portfolio) => (
        <PortfolioCard key={portfolio.slug} {...portfolio} />
      ))}
    </>
  );
}

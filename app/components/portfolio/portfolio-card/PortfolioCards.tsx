import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioCards() {
  const portfolios = getPortfolios().filter(
    (portfolio) => portfolio.status === "published",
  );
  return (
    <>
      {portfolios.map((portfolio, index) => (
        <PortfolioCard
          key={portfolio.slug}
          index={index}
          //* 첫 카드는 첫 화면에 보이므로 우선 로드한다. (LCP)
          isPriority={index === 0}
          {...portfolio}
        />
      ))}
    </>
  );
}

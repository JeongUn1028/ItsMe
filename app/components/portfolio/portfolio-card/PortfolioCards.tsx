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
          //* 넓은 화면에서는 첫 두 카드가 함께 첫 화면에 들어와, 둘째 썸네일이 LCP 가 된다. (#69)
          isPriority={index < 2}
          {...portfolio}
        />
      ))}
    </>
  );
}

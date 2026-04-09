import { getPortfolios } from "./getPortfolios";

export const getPortfolioData = (slug: string) => {
  const portfolio = getPortfolios().find(
    (portfolio) => portfolio.slug === slug,
  );

  if (!portfolio) {
    throw new Error(`Portfolio with slug "${slug}" not found.`);
  }

  return portfolio;
};

//* 클라이언트 번들로 유입되면 빌드가 실패하도록 서버 전용임을 표시합니다. (#54)
import "server-only";

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

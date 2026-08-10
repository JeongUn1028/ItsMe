import EditPortfolioComponent from "../../../../../components/portfolio/EditPortfolioForm";
import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import { use } from "react";

export async function generateStaticParams() {
  const portfolios = getPortfolios();
  return portfolios.map((portfolio) => ({
    "portfolio-slug": portfolio.slug,
  }));
}

export const dynamicParams = false;

export default function Page({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  use(params);
  return <EditPortfolioComponent params={params} />;
}

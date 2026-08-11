import { Modal } from "@/app/components/ui/modal";
import { PortfolioContent } from "@/app/components/portfolio/portfolio-slug/portfolio-content";
import { getPortfolios } from "@/lib/portfolio/getPortfolios";

export async function generateStaticParams() {
  const portfolios = getPortfolios();
  return portfolios.map((portfolio) => ({
    "portfolio-slug": portfolio.slug,
  }));
}

// 홈에서 /portfolio/[portfolio-slug]로 이동할 때 실제 페이지 대신 모달로 가로채는 라우트입니다.
export default async function PortfolioModalPage({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  const resolvedParams = await params; // params를 resolve합니다.
  return (
    // 실제 상세 페이지를 그대로 재사용하되, 모달 컨테이너 안에서 렌더링합니다.
    <Modal>
      <PortfolioContent params={resolvedParams} isModal />
    </Modal>
  );
}

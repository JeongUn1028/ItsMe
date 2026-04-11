import { Modal } from "@/app/components/ui/modal";
import { PortfolioContent } from "@/app/portfolio/[portfolio-slug]/portfolio-content";

// 홈에서 /portfolio/[portfolio-slug]로 이동할 때 실제 페이지 대신 모달로 가로채는 라우트입니다.
export default function PortfolioModalPage({
  params,
}: {
  params: Promise<{ "portfolio-slug": string }>;
}) {
  return (
    // 실제 상세 페이지를 그대로 재사용하되, 모달 컨테이너 안에서 렌더링합니다.
    <Modal>
      <PortfolioContent params={params} isModal />
    </Modal>
  );
}

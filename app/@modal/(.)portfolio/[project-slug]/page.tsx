import { Modal } from "@/app/components/ui/modal";
import Portfolio from "@/app/portfolio/[project-slug]/page";

// 홈에서 /portfolio/[project-slug]로 이동할 때 실제 페이지 대신 모달로 가로채는 라우트입니다.
export default function ProjectModalPage({
  params,
}: {
  params: Promise<{ "project-slug": string }>;
}) {
  return (
    // 실제 상세 페이지를 그대로 재사용하되, 모달 컨테이너 안에서 렌더링합니다.
    <Modal>
      <Portfolio params={params} />
    </Modal>
  );
}

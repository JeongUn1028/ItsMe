import { Modal } from "@/app/components/modal";
import Portfolio from "@/app/portfolio/[project-slug]/page";

export default function ProjectModalPage({
  params,
}: {
  params: Promise<{ "project-slug": string }>;
}) {
  return (
    <Modal>
      <Portfolio params={params} />
    </Modal>
  );
}

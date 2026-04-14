// 파일명으로 한번에 md파일, 이미지 파일 삭제

import { deleteFiles } from "../update-file/deleteFile";

//TODO - deleteFile 함수를 호출해서 삭제 하도록 변경
export async function deletePortfolio(fileName: string, thumbnail: string) {
  if (!fileName || !thumbnail) {
    return {
      success: false,
      message: "Missing fileName or thumbnail information",
    };
  }
  try {
    await deleteFiles(fileName, thumbnail);
    return {
      success: true,
      message: "파일이 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("파일 삭제 중 오류:", error);
    return {
      success: false,
      message: "파일 삭제에 실패했습니다.",
    };
  }
}

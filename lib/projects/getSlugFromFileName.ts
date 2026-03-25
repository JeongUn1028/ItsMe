//* FileName 으로부터 Slug을 추출하는 함수
export function getSlugFromFileName(fileName: string) {
  return fileName.replace(".md", "");
}

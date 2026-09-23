//* vitest 는 react-server 조건으로 해석하지 않아 실제 server-only 패키지가 에러를 던집니다.
//* 서버 전용 모듈을 단위 테스트할 수 있도록 빈 모듈로 대체합니다. (#54)
export {};

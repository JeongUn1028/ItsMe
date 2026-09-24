import { SvgIcon, type IconProps } from "./SvgIcon";

//* 봉투 윤곽선. 이전 email_icon.png 와 같은 선 굵기 비율로 그렸다.
export function EmailIcon(props: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="m3 5.5 7.6 6.6a2.2 2.2 0 0 0 2.8 0L21 5.5M3 18.5l6.9-6.2M21 18.5l-6.9-6.2" />
      </g>
    </SvgIcon>
  );
}

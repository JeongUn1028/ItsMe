import type { ReactNode, SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  //* 가로·세로 같은 크기(px)
  size?: number;
  //* 있으면 그 이름의 이미지로 읽히고, 없으면 장식으로 보고 보조기기에서 숨긴다.
  title?: string;
}

interface SvgIconProps extends IconProps {
  viewBox: string;
  children: ReactNode;
}

//* 색은 글자색(currentColor)을 따른다. 다크 모드에서 filter: invert 로 뒤집을 필요가 없다. (#44)
export function SvgIcon({ size = 18, title, viewBox, children, ...rest }: SvgIconProps) {
  const labelProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      focusable="false"
      {...labelProps}
      {...rest}
    >
      {children}
    </svg>
  );
}

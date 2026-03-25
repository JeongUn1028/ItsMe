import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);

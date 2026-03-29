import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables use cache, Partial Prerendering, and React Activity for UI state preservation
  cacheComponents: true,

  // Auto-memoizes components — reduces need for manual useMemo/useCallback
  reactCompiler: true,

  // Inlines CSS into <head> instead of <link> tags, eliminating render-blocking waterfall
  // Ideal for Tailwind (atomic CSS stays small), improves FCP/LCP for first-time visitors
  experimental: {
    inlineCss: true,
  },

  // Remove x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;

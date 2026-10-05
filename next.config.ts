import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/delete-account.html", destination: "/delete-account", permanent: true },
       { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      { source: "/pujogodeleteaccount.html", destination: "/delete-account", permanent: true },
    ];
  },
};

export default nextConfig;

"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isCaseStudy = pathname.startsWith("/work/");
  const isStudio = pathname.startsWith("/studio");
  const isTools = pathname.startsWith("/tools");

  if (isCaseStudy || isStudio || isTools) {
    return null;
  }

  return <Footer />;
}

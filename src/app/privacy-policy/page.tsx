import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import documents from "@/content/legal/documents.json";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return <LegalPage content={documents["privacy"]} path="/privacy-policy" />;
}

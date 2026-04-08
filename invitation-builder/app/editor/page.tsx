import { use } from "react";
import BuilderPageClient from "../builder-page-client";

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default function EditorPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  return (
    <BuilderPageClient
      initialParams={resolvedParams}
      initialSearchParams={resolvedSearchParams}
    />
  );
}

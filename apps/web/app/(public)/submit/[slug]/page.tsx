import React from "react";

import { ThemeRenderer } from "~/components/themes/ThemeRenderer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <ThemeRenderer slug={slug} />
    </div>
  );
};

export default page;

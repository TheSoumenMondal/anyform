import React from "react";

import StartupTheme from "~/components/themes/startup/StartupTheme";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <StartupTheme slug={slug} />
    </div>
  );
};

export default page;

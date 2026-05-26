import React from "react";
import OsTheme from "~/components/themes/os/OsTheme";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <OsTheme slug={slug} />
    </div>
  );
};

export default page;

import React from "react";
import AnimeTheme from "~/components/themes/anime/AnimeTheme";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <AnimeTheme slug={slug} />
    </div>
  );
};

export default page;

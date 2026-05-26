import React from "react";
import GameTheme from "~/components/themes/game/GameTheme";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <GameTheme slug={slug} />
    </div>
  );
};

export default page;

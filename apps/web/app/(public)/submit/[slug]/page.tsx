import React from "react";
import MovieTheme from "~/components/themes/movie/MovieTheme";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div className="w-full h-screen">
      <MovieTheme slug={slug} />
    </div>
  );
};

export default page;

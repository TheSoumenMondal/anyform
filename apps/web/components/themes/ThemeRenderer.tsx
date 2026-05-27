"use client";

import React from "react";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import AnimeTheme from "./anime/AnimeTheme";
import GameTheme from "./game/GameTheme";
import MovieTheme from "./movie/MovieTheme";
import OsTheme from "./os/OsTheme";
import StartupTheme from "./startup/StartupTheme";
import TerminalTheme from "./terminal/TerminalTheme";
import DefaultTheme from "./default/DefaultTheme";
import { Skeleton } from "~/components/ui/skeleton";

type ThemeRendererProps = {
  slug: string;
};

export const ThemeRenderer = ({ slug }: ThemeRendererProps) => {
  const { form, formIsLoading, formIsError } = usePublicFormBySlug(slug);

  if (formIsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black/5">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <Skeleton className="h-6 w-1/2 rounded-md" />
          <Skeleton className="h-32 w-full rounded-md mt-8" />
        </div>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black/5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Form Not Found</h1>
          <p className="text-muted-foreground">This form does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  switch (form.theme) {
    case "anime":
      return <AnimeTheme slug={slug} />;
    case "game":
      return <GameTheme slug={slug} />;
    case "movie":
      return <MovieTheme slug={slug} />;
    case "os":
      return <OsTheme slug={slug} />;
    case "terminal":
      return <TerminalTheme slug={slug} />;
    case "startup":
      return <StartupTheme slug={slug} />;
    case "default":
    default:
      return <DefaultTheme slug={slug} />;
  }
};

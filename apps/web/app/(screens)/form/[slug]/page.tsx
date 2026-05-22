type FormDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FormDetailsPage({ params }: FormDetailsPageProps) {
  const { slug } = await params;

  return (
    <main className="flex min-h-full flex-col gap-2 p-4 md:p-6">
      <h1 className="font-instrumental-serif text-3xl md:text-4xl">Form Details</h1>
      <p className="text-sm text-muted-foreground">{slug}</p>
    </main>
  );
}

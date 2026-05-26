import { FormBuilderEditor } from "~/components/features/form/single-step-form-builder/FormBuilderEditor";

type FormDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FormDetailsPage({ params }: FormDetailsPageProps) {
  const { slug } = await params;

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col p-2 md:p-1 overflow-hidden">
      <FormBuilderEditor slug={slug} />
    </main>
  );
}

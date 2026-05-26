import db, { eq, sql } from "@repo/database";
import { form, formField, formTemplate } from "@repo/database/schema";
import slugify from "slugify";
import { nanoid } from "nanoid";
import {
  ForkTemplateInputType,
  forkTemplateInput,
  ShareAsTemplateInputType,
  shareAsTemplateInput,
  UnshareTemplateInputType,
  unshareTemplateInput,
} from "./model";

class TemplateService {
  private generateSlug(title: string) {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      replacement: "-",
    });
    return `${baseSlug}-${nanoid(6)}`;
  }

  public async shareAsTemplate(payload: ShareAsTemplateInputType) {
    const { formId, userId } = await shareAsTemplateInput.parseAsync(payload);

    // make sure the form exists and belongs to this user
    const formResult = await db.select().from(form).where(eq(form.id, formId)).limit(1);

    if (formResult.length === 0 || !formResult[0]) {
      throw new Error("Form not found");
    }

    if (formResult[0].createdBy !== userId) {
      throw new Error("Unauthorized: you do not own this form");
    }

    const sourceForm = formResult[0];

    // check if it's already a template
    const existingTemplate = await db
      .select({ id: formTemplate.id })
      .from(formTemplate)
      .where(eq(formTemplate.formId, formId))
      .limit(1);

    if (existingTemplate.length > 0) {
      throw new Error("This form is already shared as a template");
    }

    // create the template entry
    const [newTemplate] = await db
      .insert(formTemplate)
      .values({
        title: sourceForm.title,
        description: sourceForm.description ?? undefined,
        formId,
        creator: userId,
        totalForks: 0,
      })
      .returning();

    if (!newTemplate) {
      throw new Error("Failed to create template");
    }

    return { templateId: newTemplate.id };
  }

  public async unshareTemplate(payload: UnshareTemplateInputType) {
    const { templateId, userId } = await unshareTemplateInput.parseAsync(payload);

    const templateResult = await db
      .select()
      .from(formTemplate)
      .where(eq(formTemplate.id, templateId))
      .limit(1);

    if (templateResult.length === 0 || !templateResult[0]) {
      throw new Error("Template not found");
    }

    if (templateResult[0].creator !== userId) {
      throw new Error("Unauthorized: you do not own this template");
    }

    await db.delete(formTemplate).where(eq(formTemplate.id, templateId));

    return { success: true };
  }

  public async listTemplates() {
    const templates = await db
      .select({
        id: formTemplate.id,
        title: formTemplate.title,
        description: formTemplate.description,
        formId: formTemplate.formId,
        creator: formTemplate.creator,
        totalForks: formTemplate.totalForks,
        createdAt: formTemplate.createdAt,
        updatedAt: formTemplate.updatedAt,
        // pull through the theme + formType from the source form
        theme: form.theme,
        formType: form.formType,
      })
      .from(formTemplate)
      .innerJoin(form, eq(formTemplate.formId, form.id));

    return templates;
  }

  public async getTemplatesByUserId(userId: string) {
    const templates = await db
      .select({
        id: formTemplate.id,
        title: formTemplate.title,
        description: formTemplate.description,
        formId: formTemplate.formId,
        creator: formTemplate.creator,
        totalForks: formTemplate.totalForks,
        createdAt: formTemplate.createdAt,
        updatedAt: formTemplate.updatedAt,
        theme: form.theme,
        formType: form.formType,
      })
      .from(formTemplate)
      .innerJoin(form, eq(formTemplate.formId, form.id))
      .where(eq(formTemplate.creator, userId));

    return templates;
  }

  public async forkTemplate(payload: ForkTemplateInputType) {
    const { templateId, userId } = await forkTemplateInput.parseAsync(payload);

    // get the template + source form
    const templateResult = await db
      .select({
        templateId: formTemplate.id,
        formId: formTemplate.formId,
        totalForks: formTemplate.totalForks,
      })
      .from(formTemplate)
      .where(eq(formTemplate.id, templateId))
      .limit(1);

    if (templateResult.length === 0 || !templateResult[0]) {
      throw new Error("Template not found");
    }

    const { formId: sourceFormId } = templateResult[0];

    // get the source form data
    const sourceFormResult = await db.select().from(form).where(eq(form.id, sourceFormId)).limit(1);

    if (sourceFormResult.length === 0 || !sourceFormResult[0]) {
      throw new Error("Source form not found");
    }

    const sourceForm = sourceFormResult[0];

    // default expiry — 30 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);

    // create the forked form for the new user
    const [forkedForm] = await db
      .insert(form)
      .values({
        title: sourceForm.title,
        description: sourceForm.description,
        theme: sourceForm.theme,
        formType: sourceForm.formType,
        isPublic: false,
        isProtected: false,
        password: null,
        maxSubmissionLimit: sourceForm.maxSubmissionLimit ?? 100,
        formStatus: "draft",
        expiry: defaultExpiry,
        createdBy: userId,
        forkedFromTemplateId: templateId,
        slug: this.generateSlug(sourceForm.title),
      })
      .returning();

    if (!forkedForm) {
      throw new Error("Failed to fork form");
    }

    // get all fields from the source form
    const sourceFields = await db
      .select()
      .from(formField)
      .where(eq(formField.formId, sourceFormId));

    // clone all fields into the new form
    if (sourceFields.length > 0) {
      await db.insert(formField).values(
        sourceFields.map((field) => ({
          formId: forkedForm.id,
          label: field.label,
          labelKey: field.labelKey,
          description: field.description,
          helpText: field.helpText,
          placeholder: field.placeholder,
          fieldType: field.fieldType,
          isRequired: field.isRequired,
          isHidden: field.isHidden,
          isDisabled: field.isDisabled,
          stepNumber: field.stepNumber,
          sortOrder: field.sortOrder,
          index: field.index,
          defaultValue: field.defaultValue,
          options: field.options,
          validation: field.validation,
          settings: field.settings,
          conditionalLogic: field.conditionalLogic,
          // don't copy dependsOnFieldId — it references old form's field IDs
          dependsOnFieldId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      );
    }

    // increment totalForks on the template
    await db
      .update(formTemplate)
      .set({
        totalForks: sql`${formTemplate.totalForks} + 1`,
      })
      .where(eq(formTemplate.id, templateId));

    return {
      formId: forkedForm.id,
      slug: forkedForm.slug,
    };
  }
}

export { TemplateService };

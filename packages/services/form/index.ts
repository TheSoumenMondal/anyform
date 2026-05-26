import db, { and, eq, ne } from "@repo/database";
import {
  createFormInput,
  CreateFormInputType,
  deleteFormInput,
  DeleteFormInputType,
  deleteFormPermanentlyInput,
  DeleteFormPermanentlyInputType,
  getDeletedFormsInput,
  GetDeletedFormsInputType,
  getFormBySlug,
  GetFormBySlugType,
  getFormByUserId,
  GetFormByUserIdType,
  recoverFormInput,
  RecoverFormInputType,
  updateFormInput,
  UpdateFormInputType,
} from "./model";
import { form, formResponse, formSubmission, formField } from "@repo/database/schema";
import slugify from "slugify";
import { nanoid } from "nanoid";

class FormService {
  private generateSlug(title: string) {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      replacement: "-",
    });
    return `${baseSlug}-${nanoid(6)}`;
  }

  private async checkFormOwnership(formId: string, userId: string) {
    const formData = await db
      .select({
        createdBy: form.createdBy,
      })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    const existingForm = formData[0];

    if (!existingForm) {
      throw new Error("Form not found");
    }

    if (existingForm.createdBy !== userId) {
      throw new Error("Unauthorized: You do not own this form");
    }

    return existingForm;
  }

  private async checkDeletedFormOwnership(formId: string, userId: string) {
    const formData = await db
      .select({
        createdBy: form.createdBy,
        formStatus: form.formStatus,
      })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    const existingForm = formData[0];

    if (!existingForm) {
      throw new Error("Form not found");
    }

    if (existingForm.createdBy !== userId) {
      throw new Error("Unauthorized: You do not own this form");
    }

    if (existingForm.formStatus !== "deleted") {
      throw new Error("Form must be deleted before it can be recovered or permanently deleted");
    }

    return existingForm;
  }

  public async createForm(payload: CreateFormInputType) {
    const {
      createdBy,
      title,
      expiry,
      formType,
      theme,
      isProtected,
      isPublic,
      maxSubmissionLimit,
      description,
      password,
    } = await createFormInput.parseAsync(payload);

    if (isProtected) {
      if (!password) {
        throw new Error("Password is required for protected forms");
      }
    }

    if (!isProtected && password) {
      throw new Error("Password should not be provided for unprotected forms");
    }

    const result = await db
      .insert(form)
      .values({
        createdBy,
        title,
        expiry,
        formType,
        theme,
        isProtected,
        isPublic,
        maxSubmissionLimit,
        description,
        password,
        slug: this.generateSlug(title),
      })
      .returning({ id: form.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to create form");
    }

    return result[0];
  }

  public async getFormsByUserId(payload: GetFormByUserIdType) {
    const { userId } = await getFormByUserId.parseAsync(payload);
    const result = await db
      .select({
        id: form.id,
        slug: form.slug,
        title: form.title,
        description: form.description,
        formType: form.formType,
        theme: form.theme,
        formStatus: form.formStatus,
        isPublic: form.isPublic,
        isProtected: form.isProtected,
        maxSubmissionLimit: form.maxSubmissionLimit,
        expiry: form.expiry,
        forkedFromTemplateId: form.forkedFromTemplateId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })
      .from(form)
      .where(and(eq(form.createdBy, userId), ne(form.formStatus, "deleted")));
    return result;
  }

  public async getFormBySlug(payload: GetFormBySlugType) {
    const { slug, userId } = await getFormBySlug.parseAsync(payload);
    const result = await db
      .select({
        id: form.id,
        slug: form.slug,
        title: form.title,
        description: form.description,
        formType: form.formType,
        theme: form.theme,
        formStatus: form.formStatus,
        isPublic: form.isPublic,
        isProtected: form.isProtected,
        maxSubmissionLimit: form.maxSubmissionLimit,
        expiry: form.expiry,
        forkedFromTemplateId: form.forkedFromTemplateId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })
      .from(form)
      .where(and(eq(form.slug, slug), eq(form.createdBy, userId), ne(form.formStatus, "deleted")))
      .limit(1);

    if (!result || result.length === 0) {
      throw new Error("Form not found");
    }

    return result[0]!;
  }

  public async getPublicFormBySlug(slug: string) {
    const result = await db
      .select({
        id: form.id,
        slug: form.slug,
        title: form.title,
        description: form.description,
        formType: form.formType,
        theme: form.theme,
        formStatus: form.formStatus,
        isPublic: form.isPublic,
        isProtected: form.isProtected,
        maxSubmissionLimit: form.maxSubmissionLimit,
        expiry: form.expiry,
        forkedFromTemplateId: form.forkedFromTemplateId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })
      .from(form)
      .where(and(eq(form.slug, slug), eq(form.formStatus, "published")))
      .limit(1);

    if (!result || result.length === 0) {
      throw new Error("Form not found or is not published");
    }

    return result[0]!;
  }

  public async getFormById(formId: string) {
    const result = await db
      .select({
        id: form.id,
        isProtected: form.isProtected,
        formStatus: form.formStatus,
      })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    if (!result || result.length === 0) {
      throw new Error("Form not found");
    }

    return result[0]!;
  }

  public async updateForm(payload: UpdateFormInputType) {
    const {
      formId,
      description,
      expiry,
      formType,
      theme,
      isPublic,
      isProtected,
      password,
      maxSubmissionLimit,
      title,
    } = await updateFormInput.parseAsync(payload);

    const receivedUpdateData = {
      description,
      expiry,
      formType,
      theme,
      isPublic,
      isProtected,
      password,
      maxSubmissionLimit,
      title,
    };

    await this.checkFormOwnership(formId, payload.userId);

    const cleanedUpdateData = Object.fromEntries(
      Object.entries(receivedUpdateData).filter(([, value]) => value !== undefined),
    );

    if (isProtected && !cleanedUpdateData.password) {
      throw new Error("Password is required for protected forms");
    }

    if (!isProtected && cleanedUpdateData.password) {
      throw new Error("Password should not be provided for unprotected forms");
    }

    const updatedData = await db
      .update(form)
      .set(cleanedUpdateData)
      .where(eq(form.id, formId))
      .returning({
        id: form.id,
      });

    if (!updatedData || updatedData.length === 0 || !updatedData[0]?.id) {
      throw new Error("Failed to update form");
    }

    return updatedData[0];
  }

  public async deleteForm(payload: DeleteFormInputType) {
    const { formId, userId } = await deleteFormInput.parseAsync(payload);
    await this.checkFormOwnership(formId, userId);
    await db
      .update(form)
      .set({
        formStatus: "deleted",
      })
      .where(eq(form.id, formId));

    return { success: true };
  }

  public async recoverForm(payload: RecoverFormInputType) {
    const { formId, userId } = await recoverFormInput.parseAsync(payload);
    await this.checkDeletedFormOwnership(formId, userId);

    const result = await db
      .update(form)
      .set({ formStatus: "draft" })
      .where(eq(form.id, formId))
      .returning({ id: form.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to recover form");
    }

    return result[0];
  }

  public async deleteFormPermanently(payload: DeleteFormPermanentlyInputType) {
    const { formId, userId } = await deleteFormPermanentlyInput.parseAsync(payload);
    await this.checkDeletedFormOwnership(formId, userId);

    await db.delete(form).where(eq(form.id, formId));

    return { success: true };
  }

  public async publishForm(formId: string, userId: string) {
    await this.checkFormOwnership(formId, userId);
    const result = await db
      .update(form)
      .set({ formStatus: "published" })
      .where(eq(form.id, formId))
      .returning({ id: form.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to publish form");
    }

    return result[0];
  }

  public async archiveForm(formId: string, userId: string) {
    await this.checkFormOwnership(formId, userId);
    const result = await db
      .update(form)
      .set({ formStatus: "draft" })
      .where(eq(form.id, formId))
      .returning({ id: form.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to archive form");
    }

    return result[0];
  }

  async getDeletedForms(payload: GetDeletedFormsInputType) {
    const { userId } = await getDeletedFormsInput.parseAsync(payload);
    const result = await db
      .select()
      .from(form)
      .where(and(eq(form.createdBy, userId), eq(form.formStatus, "deleted")));
    return result;
  }

  public async submitFormResponse(payload: {
    formId: string;
    responses: Record<string, unknown>;
    submissionId?: string;
  }) {
    const { formId, responses, submissionId } = payload;

    // 1. Check if form exists and is published
    const formData = await db
      .select({ id: form.id, formStatus: form.formStatus })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    if (formData.length === 0) throw new Error("Form not found");
    if (formData[0]!.formStatus !== "published") throw new Error("Form is not published");

    let finalSubmissionId = submissionId;

    if (submissionId) {
      // 2a. Update existing submission
      const [updatedSubmission] = await db
        .update(formSubmission)
        .set({
          status: "submitted",
          submittedAt: new Date(),
        })
        .where(eq(formSubmission.id, submissionId))
        .returning();

      if (!updatedSubmission) {
        // If not found, create new one as fallback
        const [newSubmission] = await db
          .insert(formSubmission)
          .values({
            formId,
            status: "submitted",
            submittedAt: new Date(),
          })
          .returning();
        finalSubmissionId = newSubmission?.id;
      }
    } else {
      // 2b. Create new submission
      const [submission] = await db
        .insert(formSubmission)
        .values({
          formId,
          status: "submitted",
          submittedAt: new Date(),
        })
        .returning();
      finalSubmissionId = submission?.id;
    }

    if (!finalSubmissionId) throw new Error("Failed to handle submission");

    // 3. Get all fields for this form to map labelKey to fieldId
    const fields = await db
      .select({ id: formField.id, labelKey: formField.labelKey })
      .from(formField)
      .where(eq(formField.formId, formId));

    const fieldMap = new Map(fields.map((f) => [f.labelKey, f.id]));

    // 4. Create responses
    const responseValues = Object.entries(responses)
      .map(([labelKey, value]) => {
        const fieldId = fieldMap.get(labelKey);
        if (!fieldId) return null;
        return {
          submissionId: finalSubmissionId,
          fieldId,
          value,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (responseValues.length > 0) {
      await db.insert(formResponse).values(responseValues);
    }

    return { success: true, submissionId: finalSubmissionId };
  }

  public async createDraftSubmission(payload: { formId: string }) {
    const { formId } = payload;

    // 1. Check if form exists and is published
    const formData = await db
      .select({ id: form.id, formStatus: form.formStatus })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    if (formData.length === 0) throw new Error("Form not found");
    if (formData[0]!.formStatus !== "published") throw new Error("Form is not published");

    // 2. Create draft submission
    const [submission] = await db
      .insert(formSubmission)
      .values({
        formId,
        status: "draft",
      })
      .returning();

    if (!submission) throw new Error("Failed to create draft submission");

    return { submissionId: submission.id };
  }

  public async verifyFormPassword(payload: { formId: string; password: string }) {
    const { formId, password } = payload;

    const formData = await db
      .select({ id: form.id, isProtected: form.isProtected, password: form.password })
      .from(form)
      .where(eq(form.id, formId))
      .limit(1);

    if (formData.length === 0) {
      throw new Error("Form not found");
    }

    const existingForm = formData[0]!;

    if (!existingForm.isProtected) {
      // If form is not protected, consider it successfully verified implicitly
      return { success: true };
    }

    if (existingForm.password !== password) {
      throw new Error("Incorrect password");
    }

    return { success: true };
  }
}

export { FormService };

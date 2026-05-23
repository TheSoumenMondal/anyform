import db, { and, eq, ne } from "@repo/database";
import {
  createFormInput,
  CreateFormInputType,
  deleteFormInput,
  DeleteFormInputType,
  getFormBySlug,
  GetFormBySlugType,
  getFormByUserId,
  GetFormByUserIdType,
  updateFormInput,
  UpdateFormInputType,
} from "./model";
import { form } from "@repo/database/schema";
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

  public async createForm(payload: CreateFormInputType) {
    const {
      createdBy,
      title,
      expiry,
      formType,
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
        formStatus: form.formStatus,
        isPublic: form.isPublic,
        isProtected: form.isProtected,
        maxSubmissionLimit: form.maxSubmissionLimit,
        expiry: form.expiry,
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
        formStatus: form.formStatus,
        isPublic: form.isPublic,
        isProtected: form.isProtected,
        maxSubmissionLimit: form.maxSubmissionLimit,
        expiry: form.expiry,
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

  public async updateForm(payload: UpdateFormInputType) {
    const {
      formId,
      description,
      expiry,
      formType,
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
}

export { FormService };

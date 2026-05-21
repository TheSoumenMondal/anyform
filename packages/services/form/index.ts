import db, { eq } from "@repo/database";
import {
  createFormInput,
  CreateFormInputType,
  getFormByUserId,
  GetFormByUserIdType,
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
      .where(eq(form.createdBy, userId));
    return result;
  }
}

export { FormService };

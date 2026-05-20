import db from "@repo/database";
import { createFormInput, CreateFormInputType } from "./model";
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
}

export { FormService };

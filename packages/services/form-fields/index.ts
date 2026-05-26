import db, { asc, eq, max } from "@repo/database";
import { form, formField } from "@repo/database/schema";
import slugify from "slugify";
import {
  CreateFormFieldInputType,
  deleteFormFieldInput,
  DeleteFormFieldInputType,
  UpdateFormFieldInputType,
} from "./model";

class FormFieldService {
  private createFormFieldLevelKey(label: string): string {
    const base = slugify(label, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    const suffix = Math.random().toString(36).slice(2, 8);
    return `${base}-${suffix}`;
  }

  private async getNextIndex(formId: string) {
    const result = await db
      .select({
        maxIndex: max(formField.index),
      })
      .from(formField)
      .where(eq(formField.formId, formId));
    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;
    return next.toFixed(2);
  }

  public async getFormFieldsByFormId(formId: string, userId: string) {
    await this.checkIfUserOwnsFormField(formId, userId);

    const result = await db
      .select()
      .from(formField)
      .where(eq(formField.formId, formId))
      .orderBy(asc(formField.sortOrder));

    return result;
  }

  public async getPublicFormFieldsByFormId(formId: string) {
    // Check if the form is published before returning fields
    const formResult = await db.select().from(form).where(eq(form.id, formId)).limit(1);
    if (formResult.length === 0 || formResult[0]?.formStatus !== "published") {
      throw new Error("Form not found or is not published");
    }

    const result = await db
      .select()
      .from(formField)
      .where(eq(formField.formId, formId))
      .orderBy(asc(formField.sortOrder));

    return result;
  }

  public async checkIfUserOwnsFormField(formId: string, userId: string) {
    const result = await db.select().from(form).where(eq(form.id, formId)).limit(1);
    if (result.length === 0) {
      throw new Error("Form not found");
    }

    if (result[0]?.createdBy !== userId) {
      throw new Error("Unauthorized: You do not own this form");
    }

    return result;
  }

  public async createFormField(payload: CreateFormFieldInputType) {
    const {
      userId,
      fieldType,
      formId,
      label,
      isDisabled,
      isHidden,
      isRequired,
      sortOrder,
      conditionalLogic,
      defaultValue,
      dependsOnFieldId,
      description,
      helpText,
      options,
      placeholder,
      settings,
      stepNumber,
      validation,
    } = payload;

    const labelKey = this.createFormFieldLevelKey(label);
    const index = await this.getNextIndex(formId);

    const form = await this.checkIfUserOwnsFormField(formId, userId);
    if (form.length === 0) {
      throw new Error("Form not found or you do not have permission to add fields to this form");
    }

    if (form[0]?.formStatus === "published") {
      throw new Error(
        "Cannot add fields to a published form. Please unpublish the form before making changes.",
      );
    }

    const [newField] = await db
      .insert(formField)
      .values({
        fieldType,
        formId,
        label,
        labelKey,
        index,

        isDisabled,
        isHidden,
        isRequired,

        sortOrder,
        conditionalLogic,
        defaultValue,
        dependsOnFieldId,

        description,
        helpText,
        options,
        placeholder,
        settings,

        stepNumber,
        validation,

        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newField;
  }

  public async updateFormField(payload: UpdateFormFieldInputType) {
    const {
      fieldId,
      userId,
      conditionalLogic,
      defaultValue,
      dependsOnFieldId,
      description,
      helpText,
      isDisabled,
      isHidden,
      isRequired,
      label,
      options,
      placeholder,
      settings,
      sortOrder,
      stepNumber,
      validation,
    } = payload;

    const existingField = await db
      .select()
      .from(formField)
      .where(eq(formField.id, fieldId))
      .limit(1);

    if (existingField.length === 0 || !existingField[0]) {
      throw new Error("Form field not found");
    }

    const updatedFormData = await this.checkIfUserOwnsFormField(existingField[0]?.formId, userId);

    if (updatedFormData.length === 0) {
      throw new Error("Form not found or you do not have permission to update fields in this form");
    }

    if (updatedFormData[0]?.formStatus === "published") {
      throw new Error(
        "Cannot update fields in a published form. Please unpublish the form before making changes.",
      );
    }

    const [updatedField] = await db
      .update(formField)
      .set({
        label,
        description,
        helpText,
        isDisabled,
        isHidden,
        isRequired,
        options,
        placeholder,
        settings,
        sortOrder,
        stepNumber,
        validation,
        conditionalLogic,
        defaultValue,
        dependsOnFieldId,
        updatedAt: new Date(),
      })
      .where(eq(formField.id, fieldId))
      .returning();

    return updatedField;
  }

  public async deleteFormField(payload: DeleteFormFieldInputType) {
    const { fieldId, userId } = await deleteFormFieldInput.parseAsync(payload);
    const existingField = await db
      .select()
      .from(formField)
      .where(eq(formField.id, fieldId))
      .limit(1);

    if (existingField.length === 0 || !existingField[0]) {
      throw new Error("Form field not found");
    }
    const formId = existingField[0]?.formId;

    const formData = await this.checkIfUserOwnsFormField(formId, userId);

    if (formData.length === 0) {
      throw new Error(
        "Form not found or you do not have permission to delete fields from this form",
      );
    }

    if (formData[0]?.formStatus === "published") {
      throw new Error(
        "Cannot delete fields from a published form. Please unpublish the form before making changes.",
      );
    }
    await db.delete(formField).where(eq(formField.id, fieldId));
    return { success: true };
  }
}

export { FormFieldService };

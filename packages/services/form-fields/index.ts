import db, { eq, max } from "@repo/database";
import { form, formField } from "@repo/database/schema";
import slugify from "slugify";
import { CreateFormFieldInputType } from "./model";

class FormFieldService {
  private createFormFieldLevelKey(label: string): string {
    return slugify(label, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
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

    if (form[0]?.createdBy !== userId) {
      throw new Error("Unauthorized: You do not own this form");
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
}

export { FormFieldService };

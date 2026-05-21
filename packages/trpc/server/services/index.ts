import AuthService from "@repo/services/auth";
import { FormService } from "@repo/services/form";
import { FormFieldService } from "@repo/services/form-fields/index";

export const formService = new FormService();
export const authService = new AuthService();
export const formFieldService = new FormFieldService();

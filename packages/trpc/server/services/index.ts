import AuthService from "@repo/services/auth";
import { FormService } from "@repo/services/form";
import { FormFieldService } from "@repo/services/form-fields/index";
import AnalyticsService from "@repo/services/analytics/index";
import { TemplateService } from "@repo/services/template/index";

export const formService = new FormService();
export const authService = new AuthService();
export const formFieldService = new FormFieldService();
export const analyticsService = new AnalyticsService();
export const templateService = new TemplateService();

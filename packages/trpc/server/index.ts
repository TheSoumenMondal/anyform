import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { analyticsRouter } from "./routes/analytics/route";
import { templateRouter } from "./routes/template/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  analytics: analyticsRouter,
  template: templateRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;

import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { songRouter } from "./song";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  song: songRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

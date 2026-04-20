import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getCampaignsByUserId, createCampaign, getSubscribersByUserId, createSubscriber, getSegmentsByUserId, createSegment, getPrebuiltTemplates, createEmailTemplate } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  campaigns: router({
    list: protectedProcedure.query(({ ctx }) =>
      getCampaignsByUserId(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        subject: z.string().optional(),
        emailContent: z.any().optional(),
      }))
      .mutation(({ ctx, input }) =>
        createCampaign({
          userId: ctx.user.id,
          name: input.name,
          subject: input.subject,
          emailContent: input.emailContent,
          status: "draft",
        })
      ),
    saveDraft: protectedProcedure
      .input(z.object({
        campaignId: z.number().optional(),
        name: z.string().min(1),
        subject: z.string().optional(),
        emailContent: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createCampaign({
          userId: ctx.user.id,
          name: input.name,
          subject: input.subject,
          emailContent: input.emailContent,
          status: "draft",
        });
      }),
  }),

  subscribers: router({
    list: protectedProcedure.query(({ ctx }) =>
      getSubscribersByUserId(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(({ ctx, input }) =>
        createSubscriber({
          userId: ctx.user.id,
          email: input.email,
          name: input.name,
          tags: input.tags,
        })
      ),
  }),

  segments: router({
    list: protectedProcedure.query(({ ctx }) =>
      getSegmentsByUserId(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        filters: z.any().optional(),
      }))
      .mutation(({ ctx, input }) =>
        createSegment({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          filters: input.filters,
        })
      ),
  }),

  templates: router({
    listPrebuilt: publicProcedure.query(() =>
      getPrebuiltTemplates()
    ),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        content: z.any().optional(),
        category: z.string().optional(),
      }))
      .mutation(({ ctx, input }) =>
        createEmailTemplate({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          content: input.content,
          category: input.category,
          isPrebuilt: false,
        })
      ),
  }),
});

export type AppRouter = typeof appRouter;

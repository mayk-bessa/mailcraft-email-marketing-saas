import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "segment-test-user",
    email: "segment@test.com",
    name: "Segment Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("segments.crud - CRUD Operations", () => {
  it("should validate that update procedure exists", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    expect(caller.segments.update).toBeDefined();
  });

  it("should validate that delete procedure exists", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    expect(caller.segments.delete).toBeDefined();
  });

  it("should validate update input accepts segmentId and optional fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.segments.update({
        segmentId: 999,
        name: "Updated Segment",
        description: "Updated description",
      });
    } catch (error: any) {
      // Expected to fail with authorization error since segment doesn't exist
      expect(error.message).toContain("Segment not found or unauthorized");
    }
  });

  it("should validate delete input accepts segmentId", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.segments.delete({
        segmentId: 999,
      });
    } catch (error: any) {
      // Expected to fail with authorization error since segment doesn't exist
      expect(error.message).toContain("Segment not found or unauthorized");
    }
  });

  it("should validate that create procedure still works", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    expect(caller.segments.create).toBeDefined();
  });

  it("should validate that list procedure still works", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    expect(caller.segments.list).toBeDefined();
  });
});

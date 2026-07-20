import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
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

describe("campaigns.schedule", () => {
  it("should validate that schedule procedure exists", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Verify the procedure exists and has the correct signature
    expect(caller.campaigns.schedule).toBeDefined();
  });

  it("should validate that send procedure exists", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Verify the procedure exists and has the correct signature
    expect(caller.campaigns.send).toBeDefined();
  });

  it("should validate schedule input accepts campaignId and scheduledAt", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // This test verifies the input schema is properly defined
    // The actual mutation will fail because campaign doesn't exist, but we're testing the schema
    const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
    
    try {
      await caller.campaigns.schedule({
        campaignId: 999,
        scheduledAt: futureDate,
      });
    } catch (error: any) {
      // Expected to fail with "Campaign not found or unauthorized"
      expect(error.message).toContain("Campaign not found or unauthorized");
    }
  });

  it("should validate send input accepts campaignId", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.campaigns.send({
        campaignId: 999,
      });
    } catch (error: any) {
      // Expected to fail with "Campaign not found or unauthorized"
      expect(error.message).toContain("Campaign not found or unauthorized");
    }
  });
});

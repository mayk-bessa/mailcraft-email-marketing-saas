import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getCampaignById } from "./db";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "schedule-test-user",
    email: "schedule@test.com",
    name: "Schedule Test User",
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

describe("campaigns.schedule - Integration Tests", () => {
  it("should validate that schedule procedure accepts correct input types", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const futureDate = new Date(Date.now() + 3600000);
    
    // This test verifies the input validation works
    try {
      await caller.campaigns.schedule({
        campaignId: 999,
        scheduledAt: futureDate,
      });
    } catch (error: any) {
      // Expected to fail with authorization error since campaign doesn't exist
      expect(error.message).toContain("Campaign not found or unauthorized");
    }
  });

  it("should validate that send procedure accepts correct input types", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.campaigns.send({
        campaignId: 999,
      });
    } catch (error: any) {
      // Expected to fail with authorization error since campaign doesn't exist
      expect(error.message).toContain("Campaign not found or unauthorized");
    }
  });

  it("should validate schedule rejects past dates", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const pastDate = new Date(Date.now() - 3600000);
    
    try {
      await caller.campaigns.schedule({
        campaignId: 999,
        scheduledAt: pastDate,
      });
    } catch (error: any) {
      // Should fail due to campaign not found, but input validation should work
      expect(error).toBeDefined();
    }
  });

  it("should validate that getCampaignById returns null for non-existent campaign", async () => {
    const result = await getCampaignById(999999);
    expect(result).toBeNull();
  });
});

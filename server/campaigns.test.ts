import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("campaigns procedures", () => {
  it("should list campaigns for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const campaigns = await caller.campaigns.list();

    expect(Array.isArray(campaigns)).toBe(true);
  });

  it("should create a campaign", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.campaigns.create({
      name: "Test Campaign",
      subject: "Test Subject",
    });

    expect(result).toBeDefined();
  });
});

describe("subscribers procedures", () => {
  it("should list subscribers for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const subscribers = await caller.subscribers.list();

    expect(Array.isArray(subscribers)).toBe(true);
  });

  it("should create a subscriber", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscribers.create({
      email: "subscriber@example.com",
      name: "Test Subscriber",
      tags: ["test"],
    });

    expect(result).toBeDefined();
  });
});

describe("segments procedures", () => {
  it("should list segments for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const segments = await caller.segments.list();

    expect(Array.isArray(segments)).toBe(true);
  });

  it("should create a segment", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.segments.create({
      name: "Test Segment",
      description: "Test Description",
    });

    expect(result).toBeDefined();
  });
});

describe("templates procedures", () => {
  it("should list prebuilt templates", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);

    const templates = await caller.templates.listPrebuilt();

    expect(Array.isArray(templates)).toBe(true);
  });

  it("should create a template", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.templates.create({
      name: "Test Template",
      description: "Test Description",
      category: "Test",
    });

    expect(result).toBeDefined();
  });
});

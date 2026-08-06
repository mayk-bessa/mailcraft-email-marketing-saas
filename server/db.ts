import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, campaigns, subscribers, segments, emailTemplates, campaignMetrics, InsertCampaign, InsertSubscriber, InsertSegment, InsertEmailTemplate, InsertCampaignMetrics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Campaign queries
export async function getCampaignsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).where(eq(campaigns.userId, userId));
}

export async function getCampaignById(campaignId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCampaign(campaign: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(campaigns).values(campaign);
}

export async function updateCampaign(campaignId: number, updates: Partial<InsertCampaign>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(campaigns).set(updates).where(eq(campaigns.id, campaignId));
}

// Subscriber queries
export async function getSubscribersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).where(eq(subscribers.userId, userId));
}

export async function createSubscriber(subscriber: InsertSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(subscribers).values(subscriber);
}

// Segment queries
export async function getSegmentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(segments).where(eq(segments.userId, userId));
}

export async function getSegmentById(segmentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(segments).where(eq(segments.id, segmentId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSegment(segment: InsertSegment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(segments).values(segment);
}

export async function updateSegment(segmentId: number, updates: Partial<InsertSegment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(segments).set(updates).where(eq(segments.id, segmentId));
}

export async function deleteSegment(segmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(segments).where(eq(segments.id, segmentId));
}

// Email Template queries
export async function getEmailTemplatesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  // Get user's custom templates (not prebuilt)
  return db.select().from(emailTemplates).where(
    eq(emailTemplates.userId, userId)
  );
}

export async function getPrebuiltTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailTemplates).where(eq(emailTemplates.isPrebuilt, true));
}

export async function createEmailTemplate(template: InsertEmailTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(emailTemplates).values(template);
}

// Campaign Metrics queries
export async function getCampaignMetrics(campaignId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(campaignMetrics).where(eq(campaignMetrics.campaignId, campaignId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCampaignMetrics(metrics: InsertCampaignMetrics) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(campaignMetrics).values(metrics);
}

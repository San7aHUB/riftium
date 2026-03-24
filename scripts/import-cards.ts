/**
 * Import Riftbound cards from dotgg API into Supabase.
 * Run once for bulk import, then on a schedule for price updates.
 *
 * Usage:
 *   npx tsx scripts/import-cards.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

const API_URL =
  "https://api.dotgg.gg/cgfw/getcards?game=riftbound&mode=indexed";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RawCard {
  id: string;
  slug: string;
  name: string;
  effect: string | null;
  flavor: string | null;
  color: string[] | null;
  cost: string | null;
  type: string;
  supertype: string;
  might: string | null;
  tags: string[] | null;
  set_name: string;
  rarity: string;
  cycle: string | null;
  image: string;
  promo: string;
  marketIds: string | null;
  price: string;
  foilPrice: string;
  deltaPrice: string;
  deltaFoilPrice: string;
  delta7dPrice: string;
  delta7dPriceFoil: string;
  cmurl: string | null;
  cmid: string | null;
  cmPrice: string | null;
  cmFoilPrice: string | null;
  cmDeltaPrice: string | null;
  cmDeltaFoilPrice: string | null;
  cmDelta7dPrice: string | null;
  cmDelta7dPriceFoil: string | null;
  hasNormal: string;
  hasFoil: string;
}

async function fetchCards(): Promise<RawCard[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  const { names, data } = json as { names: string[]; data: unknown[][] };
  return data.map((row) => {
    const obj: Record<string, unknown> = {};
    names.forEach((key, i) => (obj[key] = row[i]));
    return obj as unknown as RawCard;
  });
}

function toFloat(val: string | null): number | null {
  if (val === null || val === undefined) return null;
  const n = parseFloat(val as string);
  return isNaN(n) ? null : n;
}

async function main() {
  console.log("Fetching cards from dotgg API...");
  const cards = await fetchCards();
  console.log(`Fetched ${cards.length} cards`);

  // ── Upsert cards ──────────────────────────────────────────────────────────
  const cardRows = cards.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    effect: c.effect ?? null,
    flavor: c.flavor ?? null,
    color: c.color ?? [],
    cost: c.cost ? parseInt(c.cost) : null,
    card_type: c.type || null,
    supertype: c.supertype || null,
    might: c.might ? parseInt(c.might) : null,
    tags: c.tags ?? [],
    set_name: c.set_name || null,
    rarity: c.rarity || null,
    cycle: c.cycle ?? null,
    image_url: c.image || null,
    promo: c.promo === "1",
    has_normal: c.hasNormal === "1",
    has_foil: c.hasFoil === "1",
    cm_url: c.cmurl ?? null,
    cm_id: c.cmid ? parseInt(c.cmid) : null,
    base_card_name: c.name.replace(/\s*\([^)]*\)\s*$/, "").trim(),
    character_name: c.name.includes(" - ") ? c.name.split(" - ")[0].trim() : null,
    updated_at: new Date().toISOString(),
  }));

  const { error: cardError } = await supabase
    .from("cards")
    .upsert(cardRows, { onConflict: "id" });

  if (cardError) {
    console.error("Error upserting cards:", cardError);
    process.exit(1);
  }
  console.log(`✓ Upserted ${cardRows.length} cards`);

  // ── Insert price snapshot ─────────────────────────────────────────────────
  const priceRows = cards
    .filter((c) => toFloat(c.price) !== null || toFloat(c.foilPrice) !== null)
    .map((c) => ({
      card_id: c.id,
      price: toFloat(c.price),
      foil_price: toFloat(c.foilPrice),
      delta_1d: toFloat(c.deltaPrice),
      delta_1d_foil: toFloat(c.deltaFoilPrice),
      delta_7d: toFloat(c.delta7dPrice),
      delta_7d_foil: toFloat(c.delta7dPriceFoil),
      cm_price: toFloat(c.cmPrice),
      cm_foil_price: toFloat(c.cmFoilPrice),
    }));

  const { error: priceError } = await supabase
    .from("card_prices")
    .insert(priceRows);

  if (priceError) {
    console.error("Error inserting prices:", priceError);
    process.exit(1);
  }
  console.log(`✓ Inserted ${priceRows.length} price snapshots`);

  console.log("\nDone!");
}

main().catch(console.error);

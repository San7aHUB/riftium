/**
 * Sync Riftbound card prices from CardTrader API.
 *
 * Step 1 (first run): maps CardTrader blueprints to our cards by name,
 *                     saves cardtrader_blueprint_id on each card.
 * Step 2 (every run): fetches marketplace prices and inserts into card_prices.
 *
 * Usage:
 *   npx tsx scripts/sync-cardtrader.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   CARDTRADER_API_TOKEN
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

const CT_BASE = "https://api.cardtrader.com/api/v2";
const TOKEN = process.env.CARDTRADER_API_TOKEN!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ctHeaders = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function ctGet(path: string) {
  const res = await fetch(`${CT_BASE}${path}`, { headers: ctHeaders });
  if (!res.ok) throw new Error(`CardTrader ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

// Normalise name for fuzzy matching
function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function findRiftboundGameId(): Promise<number> {
  const resp = await ctGet("/games");
  const games = (resp.array ?? (Array.isArray(resp) ? resp : Object.values(resp))) as { display_name: string; id: number }[];
  const game = games.find((g: { display_name: string; id: number }) =>
    g.display_name?.toLowerCase().includes("riftbound") || g.display_name?.toLowerCase().includes("rift")
  );
  if (!game) throw new Error("Riftbound not found in CardTrader games list");
  console.log(`✓ Riftbound game ID: ${game.id} (${game.display_name})`);
  return game.id;
}

async function getExpansions(gameId: number): Promise<{ id: number; name: string; game_id: number }[]> {
  const resp = await ctGet(`/expansions`);
  const all = resp.array ?? (Array.isArray(resp) ? resp : Object.values(resp));
  const exps = all.filter((e: { game_id: number }) => e.game_id === gameId);
  console.log(`✓ Found ${exps.length} Riftbound expansions`);
  return exps;
}

interface Blueprint { id: number; name: string; category_id: number; image: { url: string } | null; }

async function getBlueprints(expansionId: number): Promise<Blueprint[]> {
  const data = await ctGet(`/blueprints/export?expansion_id=${expansionId}`);
  return Array.isArray(data) ? data : (data.array ?? Object.values(data));
}

function blueprintSlug(bp: Blueprint): string {
  // Extract slug from image URL: /uploads/.../preview_slug.jpg → slug
  const url = bp.image?.url ?? "";
  const match = url.match(/\/([^/]+)\.jpg$/);
  if (match) return match[1].replace(/^(show_|preview_|social_)/, "");
  // Fallback: construct from name
  return bp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getMarketplaceProducts(expansionId: number) {
  const data = await ctGet(`/marketplace/products?expansion_id=${expansionId}`);
  return data as Record<string, { price: { cents: number; currency: string }; foil: boolean; quantity: number }[]>;
}

async function main() {
  console.log("=== CardTrader Sync ===\n");

  if (!TOKEN) throw new Error("CARDTRADER_API_TOKEN not set");

  // 1. Find Riftbound game ID
  const gameId = await findRiftboundGameId();

  // 2. Get expansions
  const expansions = await getExpansions(gameId);
  if (expansions.length === 0) {
    console.log("No expansions found for Riftbound on CardTrader.");
    return;
  }

  // 3. Load our cards from Supabase
  const { data: ourCards, error: cardsErr } = await supabase
    .from("cards")
    .select("id, name, base_card_name, cardtrader_blueprint_id");
  if (cardsErr) throw new Error("Failed to load cards: " + cardsErr.message);
  console.log(`✓ Loaded ${ourCards!.length} cards from Supabase\n`);

  // Group all cards by normalized name (multiple variants share same base name)
  const cardsByNorm = new Map<string, typeof ourCards>();
  for (const c of ourCards!) {
    const key = norm(c.base_card_name ?? c.name);
    if (!cardsByNorm.has(key)) cardsByNorm.set(key, []);
    cardsByNorm.get(key)!.push(c);
  }

  let totalMapped = 0;
  let totalPrices = 0;

  for (const exp of expansions) {
    console.log(`\nProcessing expansion: ${exp.name} (ID: ${exp.id})`);

    // 4. Get blueprints and map to our cards
    let blueprints: Blueprint[] = [];
    try {
      blueprints = await getBlueprints(exp.id);
    } catch (e) {
      console.warn(`  ✗ Could not fetch blueprints: ${e}`);
      continue;
    }
    console.log(`  Blueprints: ${blueprints.length}`);

    const blueprintToCard = new Map<number, string[]>(); // blueprint_id → card ids

    for (const bp of blueprints) {
      const key = norm(bp.name);
      const cards = cardsByNorm.get(key);
      if (!cards || cards.length === 0) continue;

      const ctUrl = `https://www.cardtrader.com/en/cards/${blueprintSlug(bp)}`;

      if (!blueprintToCard.has(bp.id)) blueprintToCard.set(bp.id, []);
      for (const card of cards) {
        blueprintToCard.get(bp.id)!.push(card.id);

        if (!card.cardtrader_blueprint_id) {
          await supabase.from("cards").update({ cardtrader_blueprint_id: bp.id, cardtrader_url: ctUrl }).eq("id", card.id);
          card.cardtrader_blueprint_id = bp.id;
          totalMapped++;
        }
      }
    }

    // 5. Fetch marketplace prices
    let products: Record<string, { price: { cents: number }; foil: boolean; quantity: number }[]>;
    try {
      products = await getMarketplaceProducts(exp.id);
    } catch (e) {
      console.warn(`  ✗ Could not fetch prices: ${e}`);
      continue;
    }

    const priceRows: {
      card_id: string;
      price: number | null;
      foil_price: number | null;
      source: string;
    }[] = [];

    const seen = new Set<string>(); // deduplicate per card

    for (const [bpIdStr, listings] of Object.entries(products)) {
      const bpId = parseInt(bpIdStr);
      const cardIds = blueprintToCard.get(bpId);
      if (!cardIds) continue;

      let minNormal: number | null = null;
      let minFoil: number | null = null;

      for (const listing of listings) {
        const priceEur = listing.price.cents / 100;
        if (listing.foil) {
          if (minFoil === null || priceEur < minFoil) minFoil = priceEur;
        } else {
          if (minNormal === null || priceEur < minNormal) minNormal = priceEur;
        }
      }

      if (minNormal !== null || minFoil !== null) {
        for (const cardId of cardIds) {
          if (seen.has(cardId)) continue;
          priceRows.push({ card_id: cardId, price: minNormal, foil_price: minFoil, source: "cardtrader" });
          seen.add(cardId);
        }
      }
    }

    if (priceRows.length > 0) {
      const { error } = await supabase.from("card_prices").insert(priceRows);
      if (error) console.warn(`  ✗ Price insert error: ${error.message}`);
      else {
        console.log(`  ✓ Inserted ${priceRows.length} price snapshots`);
        totalPrices += priceRows.length;
      }
    } else {
      console.log(`  — No prices found`);
    }

    // Respect rate limits
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\n=== Done ===`);
  console.log(`Blueprints mapped: ${totalMapped}`);
  console.log(`Price snapshots inserted: ${totalPrices}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

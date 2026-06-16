# Content Packs Auction — One Pager
**Tango · Revenue Monetization · June 2026**

---

## Context: Two Features That Belong Together

### My Vault
My Vault is a **private media gallery for creators** — launched February 2026 on Web Desktop, now rolling out on Android. It is the single source of truth for all creator content on Tango.

**What it does today:**
- Creator uploads photos and videos, organises them into Albums
- AI Chatbot (with toggle: *Allow AI Chatbot to use My Vault*) automatically creates Content Packs from Vault content and sells them 24/7 in offline chats
- Content imported from the Private folder (auto-pulled from offline chat history) or uploaded directly by the creator
- Vault → Content Pack → Offline Chat sale is the current monetization loop
- Key pitch: *"Store all your spicy content in one place. Let AI help sell your content 24/7 in chats."*

**Current state:**
- 69k assets uploaded on launch day (77% auto-import, 23% direct)
- Campaign June 12–17: creators earn 2,000–25,000 Diamonds for uploading 100+ new spicy assets
- Creators lack visibility into how Vault content is performing — **no revenue insights inside My Vault today**

### NFT Card Auction (existing)
Tango's auction mechanic assigns **NFT cards to creators**. Gifters bid on cards using coins. The creator earns from the bids.

**Current mechanics:**
- Cards are created by LiveOps/RevOps and assigned to creators
- Gifters bid from a leaderboard during an auction window
- Notifications: *"You got a new bid," "Raise your bid," "Card sold," "You won"*
- Auction leaderboard tracks total value bid per gifter and total sold per card owner
- Top 100–300 card owners qualify for Tango Awards Tournament — auction as a competitive qualifier
- Fully functioning auction infrastructure: `auction_started` + `auction_lot_started` events, Optimove lifecycle campaigns

**Gap:** The card that goes to auction is generic — it has no direct connection to the creator's actual content. The gifter is bidding on a creator's brand, not a specific exclusive pack.

---

## The New Idea: Content Packs Auction

**One-line pitch:** Let creators fill a Vault folder with exclusive content → the system converts it into an NFT card → the card goes to live auction → gifters bid for exclusive access during the creator's stream.

### How it works

| Step | Actor | Action |
|------|-------|--------|
| 1 | Creator | Creates an **Auction Folder** inside My Vault, adds X exclusive photos/videos |
| 2 | System | Auto-generates an NFT card previewing the pack (teaser thumbnail, asset count, flirty level) |
| 3 | Creator | Pins the card to their live stream screen — gifters can see the pack and bid live |
| 4 | Gifters | Bid on the card during the stream; each bid triggers an **in-stream gift animation with the bid amount** |
| 5 | Auction ends | Highest bidder wins exclusive access to the full content pack |
| 6 | Creator earns | Diamonds/coins from all bids, not just the winner's final bid |

---

## Features to Build

### 1. Vault Auction Folder
A new folder type inside My Vault. Creator sets a target number of assets (e.g. 10, 20, 50). System shows a progress bar: *"Add 8 more to unlock your card."*
- Content: photos + videos, both count
- Minimum threshold before card is generated (configurable)
- Only direct uploads count — no Private folder/auto-import content
- Creator can preview what the gifter preview will look like before going live

### 2. NFT Card Auto-Generation from Vault Folder
When the Auction Folder is filled (or the creator manually triggers it), the system:
- Mints an NFT card with a teaser grid (first 4–9 assets blurred/watermarked)
- Displays: creator name, asset count, flirty level, bid start price
- Card is linked to `auction_lot_started` for the creator, `auction_started` for viewers

### 3. Auction Sign on Creator Leaderboard
- Add an auction icon/badge to the **left of the creator's name on the leaderboard** when they have an active auction running
- Tapping the icon opens a mini-card preview with a "Bid Now" CTA
- Consistent with existing leaderboard UX; no structural change needed

### 4. In-Stream Gift Animation with Bid Amount
- When a gifter places a bid, trigger a custom gift animation inside the live stream
- Animation displays: gifter's name + bid amount in coins
- Raises excitement in the stream room and signals to other viewers that bidding is live
- Leverage existing gift animation infrastructure (`STREAM_BOOSTER` / new `AUCTION_BID` transaction type)

### 5. Revenue Insights Inside My Vault
A new tab or section inside My Vault: **"My Earnings"**
- Total earned from Content Pack sales (AI bot offline chat)
- Total earned from Auction bids (current + historical)
- Top-performing assets (by sales)
- Flirty level breakdown per album
- Suggested action: *"Your last auction folder sold for 45,000 coins — add more to the next one"*
- Data already tracked in BQ (`finance_journal`, `vault` domain tables) — needs frontend surface

---

## Why This Works

| Mechanic | Creator benefit | Gifter benefit | Tango benefit |
|----------|----------------|----------------|---------------|
| Vault Auction Folder | Monetizes exclusive content with zero extra effort | Guaranteed exclusive access — not just a digital card | More Vault uploads, higher content quality |
| In-stream bidding | Drives gifts during stream, boosts stream engagement | Competitive, live social experience | Higher ARPPU from high-intent buyers |
| Auction sign on leaderboard | Creator visibility during auction | Easy discovery of live auctions | Cross-feature loop: stream → auction → leaderboard |
| Revenue Insights in Vault | Visibility into what content sells | — | Creator stickiness and re-upload behavior |

---

## North Star Metrics

- **Creator activation:** % of eligible creators who create an Auction Folder within 7 days of feature launch
- **Content volume:** avg assets per Auction Folder (target: >20 spicy assets per card)
- **Auction revenue:** coins bid per card per auction window
- **Stream uplift:** gift rate during streams with live auction vs. control
- **Vault retention:** % of creators who upload to Vault again within 14 days after first auction

---

## Open Questions

1. **Minimum asset count** to generate a card — what's the right threshold? (Suggest: 10 photos or 5 videos)
2. **Bid floor** — should there be a minimum first bid? (Suggest: align with existing auction entry bid ~5,000 coins)
3. **Exclusive access mechanics** — does the winner get the full pack in chat? For how long? Is it one-time or permanent?
4. **Creator opt-in** — is the Auction Folder a toggle inside My Vault, or does LiveOps assign it like current cards?
5. **Flirty level gate** — should only creators with flirty level 4–5 content unlock the Auction Folder?
6. **Notifications automation** — use existing `auction_lot_started` + `auction_started` Optimove pipeline (already designed by Karin/Dana, Jun 11)

---

## Suggested Phasing

| Phase | Scope | Goal |
|-------|-------|------|
| **MVP** | Vault Auction Folder + card auto-generation + existing auction infra | Test creator adoption and card fill rate |
| **V1** | In-stream bid animation + auction sign on leaderboard | Drive gifter engagement during live streams |
| **V2** | Revenue Insights in My Vault | Increase creator retention and re-upload rate |

---

*Sources: Slack (#release, #monetization_team, #auction-launch, #production-issues, DMs), BigQuery vault domain, internal product discussions Jun 2026.*

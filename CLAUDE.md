# BEV Weekly Work Plan — Scheduling Rules

## Overview

Generate a weekly BEV work plan for the coming Monday–Sunday. Target: **20 BEV hours per week**.

## Step 1 — Fetch Calendar Data

Fetch all events for the week ahead (Monday 00:00 to Sunday 23:59, **Asia/Singapore** timezone) from both calendars:
- `linhan@betterearthventures.com` — primary BEV calendar (committed BEV hours)
- `mrwulinhan@gmail.com` — personal calendar (blockers, IWPT events)

## Step 2 — Calculate Committed BEV Hours

Sum the duration of all events on `linhan@betterearthventures.com`. Subtract from 20 hours to find the remaining hours to schedule as BEV Work blocks.

> **Wednesday rule:** Wednesday is Work Together day and always counts as **8 hours** of BEV work, regardless of individual event durations on that day.

## Step 3 — Scheduling Rules for BEV Work Blocks

Apply these rules strictly when proposing BEV Work blocks:

| Rule | Detail |
|------|--------|
| **Front-load** | Fill Monday first, then Tuesday, before later days |
| **Tuesday** | Mornings available; afternoons must stay free (no BEV blocks from 12:00pm onwards) |
| **Wednesday** | Work Together day — counts as 8 hrs BEV; no additional blocks needed |
| **Thursday** | Must remain completely empty — no BEV blocks |
| **Friday** | Available after lunch only (start ≥ 12:00pm); capped at **2 hours maximum** total |
| **IWPT events** | Any event labelled `IWPT` on either calendar is off-limits — do not schedule BEV blocks during these times, including the **30 minutes before and after** each IWPT event |

## Step 4 — Output Summary Table

Output a table with the following columns:

| Day | Committed BEV Events | Proposed BEV Blocks | Day Total | Running Total | Remaining |
|-----|---------------------|---------------------|-----------|---------------|-----------|

Include a note on **total hours scheduled vs. the 20-hour target**.

Then ask: **"Shall I go ahead and block these times on your calendar?"** and wait for explicit approval before proceeding.

## Step 5 — Create Calendar Blocking Events (after approval)

Only after the user approves the proposed plan, create **"BEV Work"** events on `linhan@betterearthventures.com` to block out all approved BEV Work slots. Set availability to **Busy**.

## Step 6 — Draft Team Message

After the calendar events are created, draft a short, friendly message the user can send to the BEV team summarising when they'll be working that week. Use natural language (e.g. "morning", "afternoon", "most of the day") rather than exact times. Follow this format:

---
Hey morning team, here's when I'll be working this week:

• Monday: [summary]
• Tuesday: [summary]
• Wednesday: [summary]
• Thursday: [summary]
• Friday: [summary]

Outside of these hours I'm still reachable, so feel free to drop me a message anytime.
---

Do not use em-dashes (—) anywhere in the message. Use commas, "and", or rephrase instead.

Present the draft and ask if the user would like to send or adjust it.

If calendar data is unavailable or incomplete, note what is missing and proceed with available data.

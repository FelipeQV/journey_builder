const API_URL = 'https://api.anthropic.com/v1/messages'
const HEADERS = (key) => ({
  'Content-Type': 'application/json',
  'x-api-key': key,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
})

async function callClaude(key, system, userMessage) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: HEADERS(key),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'API error')
  return data.content.map((b) => b.text || '').join('')
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

// ── Phase 1 → 2: Extract raw journey + propose lanes ──────────────────────
const LANE_TYPES = {
  journey_narrative: 'Future-state journey',
  touchpoint: 'Touchpoint',
  data: 'Data captured',
  happy_path: 'Happy path',
  exception: 'Exception',
  technology: 'Technology enablers',
}

export async function extractJourney(key, rawInput) {
  const system = `You are a service design expert. Extract a user journey from the input and return ONLY valid JSON.

Schema:
{
  "title": "Short journey title",
  "persona": "Who the user is (1 sentence)",
  "proposed_lanes": [
    { "id": "journey_narrative", "label": "Future-state journey", "matchName": "Future-state journey", "group": "frontstage" },
    { "id": "touchpoint", "label": "Touchpoint", "matchName": "Touchpoint", "group": "frontstage" },
    { "id": "actor__<ActorName>", "label": "<ActorName>", "matchName": "<ActorName>", "group": "frontstage" },
    { "id": "operation", "label": "Operation", "matchName": "Operation", "group": "backstage" },
    { "id": "data", "label": "Data captured", "matchName": "Data captured", "group": "backstage" },
    { "id": "automation", "label": "Automation", "matchName": "Automation", "group": "backstage" },
    { "id": "technology", "label": "Technology enablers", "matchName": "Technology enablers", "group": "backstage" }
  ],
  "steps": [
    {
      "id": "step_1",
      "label": "Step name (3-5 words)",
      "journey_narrative": "What the user does (max 15 words)",
      "touchpoint": ["Channel or interface"],
      "happy_path": "Ideal flow description (max 12 words, or null)",
      "exception": "Failure or edge case (max 12 words, or null)",
      "data": "Data captured (max 10 words, or null)",
      "actors": [
        { "lane_id": "actor__<exact_id_from_proposed_lanes>", "action": "What they do at this step (max 12 words)", "is_exception": false }
      ],
      "automation": [{ "trigger": "What triggers it (max 8 words)", "output": "What it does automatically (max 10 words)" }],
      "technology": [{ "name": "System name", "highlighted": true }]
    }
  ],
  "annotations": [
    { "section": "customer_journey", "title": "3-5 word title", "description": "Max 20 words" },
    { "section": "operation", "title": "3-5 word title", "description": "Max 20 words" },
    { "section": "technology", "title": "3-5 word title", "description": "Max 20 words" }
  ]
}

Rules:
- proposed_lanes must include journey_narrative, touchpoint, data, technology always
- Add one lane per distinct actor found in the input, id format: actor__<ActorName>
- group: "frontstage" = journey, touchpoints, and actors the user directly interacts with; "backstage" = data systems, technology, hidden operations
- actors[].lane_id must exactly match the id of the corresponding proposed_lane (e.g. "actor__Site_Supervisor")
- automation: only populate when something genuinely runs automatically without human action
- Return ONLY the raw JSON object, no markdown`

  const text = await callClaude(key, system, rawInput)
  return parseJSON(text)
}

// ── Phase 3: Apply a targeted instruction to the current journey ───────────
export async function applyInstruction(key, journey, instruction) {
  const system = `You are a service design expert. Apply the user's instruction to the journey JSON and return ONLY the modified JSON.
Rules:
- Keep everything not mentioned in the instruction exactly as-is
- Preserve the same schema and all lane_ids in actors
- Return ONLY the raw JSON object, no markdown`

  const text = await callClaude(key, system, `Instruction: ${instruction}\n\nCurrent journey:\n${JSON.stringify(journey, null, 2)}`)
  return parseJSON(text)
}

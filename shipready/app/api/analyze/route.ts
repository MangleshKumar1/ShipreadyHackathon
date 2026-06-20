import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://shipready.vercel.app',
    'X-Title': 'ShipReady',
  },
})

export async function POST(request: NextRequest) {
  try {
    const { feedback, context } = await request.json()

    if (!feedback || feedback.trim().length < 10) {
      return NextResponse.json({ error: 'Please paste more feedback' }, { status: 400 })
    }

    const prompt = `You are a senior product manager analyzing customer feedback. Be specific and extract real themes from the actual feedback provided.

Product context: ${context || 'Not specified'}

Customer feedback:
${feedback}

Return ONLY a raw JSON object. No markdown. No code blocks. No explanation. Just JSON:

{
  "total_analyzed": <count feedback items>,
  "executive_summary": "<2 sentences about main issues>",
  "themes": [
    {
      "rank": 1,
      "name": "<specific theme name>",
      "opportunity_score": <number 1-10>,
      "sentiment": "negative",
      "impact": "high",
      "effort": "low",
      "is_quick_win": false,
      "evidence": [
        {
          "quote": "<short exact phrase from feedback>",
          "count": <number>
        }
      ]
    }
  ],
  "decisions": {
    "build_now": {
      "theme": "<theme name>",
      "reasoning": "<specific reason>",
      "evidence_strength": "<X of Y users>"
    },
    "plan_later": [
      {"theme": "<name>", "reason": "<reason>"}
    ],
    "quick_wins": [
      {"theme": "<name>", "reason": "<reason>"}
    ],
    "low_signal": [
      {"theme": "<name>", "reason": "<reason>"}
    ]
  }
}

Rules:
- Find 2-4 themes from actual feedback only
- Quotes MUST come from actual feedback text
- Opportunity Score = (Frequency x Impact) / Effort
- Return ONLY the JSON object`

    const response = await client.chat.completions.create({
      model: 'anthropic/claude-sonnet-4-5',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    })

    const text = response.choices[0].message.content || ''
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()

    const result = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Analyze API error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AI returned invalid response. Try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}

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
    const { theme, context } = await request.json()

    const prompt = `You are a senior PM writing a PRD.

Feature: ${theme.name}
Product: ${context || 'B2B SaaS product'}
Evidence from customers: ${JSON.stringify(theme.evidence)}
Opportunity score: ${theme.opportunity_score}/10

Return ONLY raw JSON, no markdown, no explanation:

{
  "title": "${theme.name}",
  "problem_statement": "<specific problem>",
  "target_user": "<who this helps>",
  "user_stories": [
    {
      "story": "As a <user> I want <goal> so that <benefit>",
      "evidence_quote": "<quote from evidence>",
      "evidence_count": <number>
    }
  ],
  "success_metrics": [
    "<metric with numbers>"
  ],
  "edge_cases": ["<case>"],
  "risks": ["<risk>"],
  "acceptance_criteria": ["<testable criteria>"],
  "sources_summary": "Based on customer feedback provided"
}

Write 2-3 user stories minimum.
Each story must reference the evidence provided.
Return ONLY the JSON object.`

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
    console.error('PRD API error:', error)
    return NextResponse.json(
      { error: 'PRD generation failed. Please try again.' },
      { status: 500 }
    )
  }
}

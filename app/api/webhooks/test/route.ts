import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return Response.json({
    message: "Webhook endpoint is working!",
    timestamp: new Date().toISOString(),
    url: req.url
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    console.log('🔍 Webhook received:', body.substring(0, 100) + '...')
    
    return Response.json({
      received: true,
      timestamp: new Date().toISOString(),
      bodyLength: body.length
    })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

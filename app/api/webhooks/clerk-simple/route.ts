export async function GET() {
  return Response.json({ 
    message: "Webhook Clerk endpoint is working!",
    timestamp: new Date().toISOString()
  })
}

export async function POST(req: Request) {
  console.log('🎯 WEBHOOK REÇU !', new Date().toISOString())
  
  try {
    const body = await req.text()
    console.log('📦 Body length:', body.length)
    console.log('📦 Body preview:', body.substring(0, 200))
    
    const headers = Object.fromEntries(req.headers.entries())
    console.log('📋 Headers:', headers)
    
    return Response.json({ 
      success: true,
      received: true,
      timestamp: new Date().toISOString(),
      bodyLength: body.length
    })
  } catch (error) {
    console.error('❌ Erreur webhook:', error)
    return Response.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

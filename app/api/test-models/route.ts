import { NextResponse } from 'next/server'
import { FREE_MODELS } from '@/lib/models'

export async function GET() {
  return NextResponse.json({
    models: FREE_MODELS,
    totalModels: FREE_MODELS.length,
    status: 'Available models for rotation'
  })
}
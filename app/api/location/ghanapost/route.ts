import { NextRequest, NextResponse } from "next/server"

const DIGITAL_ADDRESS_REGEX = /\b[A-Z]{2}-\d{3,4}-\d{3,4}\b/i
const REQUEST_TIMEOUT_MS = 3500

const extractDigitalAddress = (payload: unknown): string | null => {
  if (typeof payload === "string") {
    const match = payload.match(DIGITAL_ADDRESS_REGEX)
    return match ? match[0].toUpperCase() : null
  }

  try {
    const serialized = JSON.stringify(payload)
    const match = serialized.match(DIGITAL_ADDRESS_REGEX)
    return match ? match[0].toUpperCase() : null
  } catch {
    return null
  }
}

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      signal: controller.signal,
      cache: "no-store",
    })
  } finally {
    clearTimeout(timer)
  }
}

const resolveDigitalAddressFromUrl = async (url: string) => {
  const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS)
  if (!response.ok) {
    throw new Error(`Non-OK response from ${url}`)
  }

  const raw = await response.text()
  const directMatch = extractDigitalAddress(raw)
  if (directMatch) {
    return { digitalAddress: directMatch, source: url }
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const jsonMatch = extractDigitalAddress(parsed)
    if (jsonMatch) {
      return { digitalAddress: jsonMatch, source: url }
    }
  } catch {
    // Continue to no-match error.
  }

  throw new Error(`No digital address match from ${url}`)
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"))
  const lng = Number(request.nextUrl.searchParams.get("lng"))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ digitalAddress: null, error: "Invalid coordinates" }, { status: 400 })
  }

  const candidateUrls = [
    `https://ghanapostgps.sperixlabs.org/get-address?lat=${lat}&lng=${lng}`,
    `https://ghanapostgps.sperixlabs.org/get-address?latitude=${lat}&longitude=${lng}`,
    `https://ghanapostgps.sperixlabs.org/get-location?lat=${lat}&lng=${lng}`,
  ]

  try {
    const firstResolved = await Promise.any(candidateUrls.map((url) => resolveDigitalAddressFromUrl(url)))
    return NextResponse.json(firstResolved)
  } catch {
    return NextResponse.json({ digitalAddress: null })
  }
}

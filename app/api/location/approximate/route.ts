import { NextResponse } from "next/server"

type ApproximateResult = {
  latitude: number
  longitude: number
  label: string
  source: string
}

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    })
  } finally {
    clearTimeout(timer)
  }
}

const fromIpApi = async (): Promise<ApproximateResult> => {
  const response = await fetchWithTimeout("https://ipapi.co/json/", 3000)
  if (!response.ok) {
    throw new Error("ipapi request failed")
  }

  const payload = (await response.json()) as {
    latitude?: number
    longitude?: number
    city?: string
    region?: string
    country_name?: string
  }

  if (typeof payload.latitude !== "number" || typeof payload.longitude !== "number") {
    throw new Error("ipapi missing coordinates")
  }

  const label = [payload.city, payload.region, payload.country_name].filter(Boolean).join(", ")
  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
    label,
    source: "ipapi.co",
  }
}

const fromIpInfo = async (): Promise<ApproximateResult> => {
  const response = await fetchWithTimeout("https://ipinfo.io/json", 3000)
  if (!response.ok) {
    throw new Error("ipinfo request failed")
  }

  const payload = (await response.json()) as {
    loc?: string
    city?: string
    region?: string
    country?: string
  }

  if (!payload.loc) {
    throw new Error("ipinfo missing loc")
  }

  const [latRaw, lonRaw] = payload.loc.split(",")
  const latitude = Number(latRaw)
  const longitude = Number(lonRaw)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("ipinfo invalid loc format")
  }

  const label = [payload.city, payload.region, payload.country].filter(Boolean).join(", ")
  return {
    latitude,
    longitude,
    label,
    source: "ipinfo.io",
  }
}

const fromIpWho = async (): Promise<ApproximateResult> => {
  const response = await fetchWithTimeout(
    "https://ipwho.is/?fields=success,latitude,longitude,city,region,country,message",
    3000,
  )
  if (!response.ok) {
    throw new Error("ipwho request failed")
  }

  const payload = (await response.json()) as {
    success?: boolean
    latitude?: number
    longitude?: number
    city?: string
    region?: string
    country?: string
    message?: string
  }

  if (!payload.success || typeof payload.latitude !== "number" || typeof payload.longitude !== "number") {
    throw new Error(payload.message ?? "ipwho missing coordinates")
  }

  const label = [payload.city, payload.region, payload.country].filter(Boolean).join(", ")
  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
    label,
    source: "ipwho.is",
  }
}

export async function GET() {
  const providers = [fromIpApi, fromIpInfo, fromIpWho]

  for (const provider of providers) {
    try {
      const result = await provider()
      return NextResponse.json(result)
    } catch {
      // Try next provider.
    }
  }

  return NextResponse.json({ error: "Unable to resolve approximate location" }, { status: 502 })
}

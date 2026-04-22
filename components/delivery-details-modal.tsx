"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react"

export interface DeliveryDetailsFormValues {
  neighborhood: string
  gpsAddress: string
  landmark: string
  phone: string
  latitude?: number
  longitude?: number
  coordinateLabel?: string
  resolvedAddress?: string
}

interface DeliveryDetailsModalProps {
  isOpen: boolean
  initialPhone?: string
  onClose: () => void
  onBack: () => void
  onProceed: (details: DeliveryDetailsFormValues) => void
}

const ACCRA_NEIGHBORHOODS = [
  "Labone",
  "Cantonments",
  "Osu",
  "East Legon",
  "Airport Residential",
  "Ridge",
  "Dzorwulu",
  "Roman Ridge",
  "North Ridge",
  "Tesano",
  "Abelemkpe",
  "Adabraka",
  "Asylum Down",
  "Kanda",
  "Dansoman",
  "Teshie",
  "Nungua",
  "Spintex",
  "Madina",
  "Achimota",
  "Haatso",
  "Ringway Estates",
]

type Coordinates = {
  latitude: number
  longitude: number
}

const TARGET_GPS_ACCURACY_METERS = 120
const AUTO_FILL_MAX_ACCURACY_METERS = 350
const WATCH_BEST_GPS_WINDOW_MS = 7000

type GeolocationErrorLike = {
  code?: number
  message?: string
}

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "")
  let localDigits = digits

  if (localDigits.startsWith("233")) {
    localDigits = localDigits.slice(3)
  }
  if (localDigits.startsWith("0")) {
    localDigits = localDigits.slice(1)
  }

  localDigits = localDigits.slice(0, 9)

  if (!localDigits) {
    return "+233 "
  }

  return `+233 ${localDigits}`
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()

const findMatchingNeighborhood = (candidate: string) => {
  const normalizedCandidate = normalizeText(candidate)
  if (!normalizedCandidate) {
    return null
  }

  const exact = ACCRA_NEIGHBORHOODS.find((area) => normalizeText(area) === normalizedCandidate)
  if (exact) {
    return exact
  }

  return (
    ACCRA_NEIGHBORHOODS.find((area) => {
      const normalizedArea = normalizeText(area)
      return normalizedArea.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedArea)
    }) ?? null
  )
}

const chooseNeighborhood = (address: Record<string, string | undefined>) => {
  const candidates = [
    address.neighbourhood,
    address.suburb,
    address.city_district,
    address.quarter,
    address.village,
    address.town,
    address.city,
    address.municipality,
    address.county,
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    const matched = findMatchingNeighborhood(candidate)
    if (matched) {
      return matched
    }
  }

  return null
}

const toCoordinateLabel = (coords: Coordinates) =>
  `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`

const buildMapEmbedUrl = (coords: Coordinates | null) => {
  if (!coords) {
    return null
  }

  const delta = 0.008
  const minLon = coords.longitude - delta
  const maxLon = coords.longitude + delta
  const minLat = coords.latitude - delta
  const maxLat = coords.latitude + delta

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`
}

const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    })
  })

const getCurrentPositionWithOptions = (options: PositionOptions) =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })

const waitForBestGpsPosition = async () => {
  const first = await getCurrentPosition()
  let best = first

  if (first.coords.accuracy <= TARGET_GPS_ACCURACY_METERS) {
    return first
  }

  await new Promise<void>((resolve) => {
    let settled = false
    let watchId: number | null = null

    const done = () => {
      if (settled) {
        return
      }
      settled = true
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
      resolve()
    }

    const timeoutId = window.setTimeout(done, WATCH_BEST_GPS_WINDOW_MS)

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy < best.coords.accuracy) {
          best = position
        }

        if (best.coords.accuracy <= TARGET_GPS_ACCURACY_METERS) {
          window.clearTimeout(timeoutId)
          done()
        }
      },
      () => {
        window.clearTimeout(timeoutId)
        done()
      },
      {
        enableHighAccuracy: true,
        timeout: WATCH_BEST_GPS_WINDOW_MS,
        maximumAge: 0,
      },
    )
  })

  return best
}

const isLocalhostHost = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"

const parseGeolocationError = (error: unknown): GeolocationErrorLike => {
  if (error && typeof error === "object") {
    const maybe = error as { code?: unknown; message?: unknown }
    return {
      code: typeof maybe.code === "number" ? maybe.code : undefined,
      message: typeof maybe.message === "string" ? maybe.message : undefined,
    }
  }

  if (typeof error === "string") {
    return { message: error }
  }

  return {}
}

const getLocationErrorMessage = (error: unknown) => {
  const parsed = parseGeolocationError(error)
  const text = (parsed.message ?? "").toLowerCase()

  if (parsed.code === 1) {
    return "Location was denied by browser or device settings. Check site and OS location settings, then try again. If you are testing in an embedded preview, open the app in a full browser."
  }
  if (parsed.code === 2) {
    return "Your location is currently unavailable. Check GPS/network and try again."
  }
  if (parsed.code === 3) {
    return "Location lookup timed out. Please try again in an open area."
  }

  if (text.includes("secure") || text.includes("https") || text.includes("only secure origins")) {
    return "Location access requires HTTPS (or localhost). Open the app on a secure URL and try again."
  }

  if (parsed.message) {
    return `Could not get your current location: ${parsed.message}`
  }

  return "Could not get your current location. Please try again."
}

const fetchReverseLocation = async (coords: Coordinates) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error("Reverse location lookup failed")
  }

  const data = (await response.json()) as {
    display_name?: string
    address?: Record<string, string | undefined>
  }

  const address = data.address ?? {}
  const neighborhood = chooseNeighborhood(address)

  return {
    neighborhood,
    displayAddress: data.display_name ?? "",
  }
}

const fetchApproximateLocationByIp = async () => {
  const response = await fetch("/api/location/approximate", {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Approximate location API failed")
  }

  const payload = (await response.json()) as {
    latitude?: number
    longitude?: number
    label?: string
    source?: string
  }

  if (typeof payload.latitude !== "number" || typeof payload.longitude !== "number") {
    throw new Error("Approximate location API returned invalid coordinates")
  }

  return {
    coordinates: {
      latitude: payload.latitude,
      longitude: payload.longitude,
    },
    label: payload.label ?? "",
    source: payload.source ?? "",
  }
}

export default function DeliveryDetailsModal({
  isOpen,
  initialPhone,
  onClose,
  onBack,
  onProceed,
}: DeliveryDetailsModalProps) {
  const [form, setForm] = useState<DeliveryDetailsFormValues>({
    neighborhood: "",
    gpsAddress: "",
    landmark: "",
    phone: "+233 ",
  })
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("")
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryDetailsFormValues, string>>>({})
  const [isLocating, setIsLocating] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null)
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [locationStatus, setLocationStatus] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = prefersReducedMotion || isMobile
  const locateTokenRef = useRef(0)
  const mapEmbedUrl = useMemo(() => buildMapEmbedUrl(coordinates), [coordinates])
  const coordinateLabel = useMemo(() => (coordinates ? toCoordinateLabel(coordinates) : ""), [coordinates])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      locateTokenRef.current += 1
      setIsLocating(false)
      return
    }

    setForm({
      neighborhood: "",
      gpsAddress: "",
      landmark: "",
      phone: normalizePhone(initialPhone ?? ""),
    })
    setNeighborhoodQuery("")
    setIsNeighborhoodOpen(false)
    setErrors({})
    setIsLocating(false)
    setCoordinates(null)
    setGpsAccuracyMeters(null)
    setResolvedAddress("")
    setLocationStatus("")
  }, [initialPhone, isOpen])

  const filteredNeighborhoods = useMemo(() => {
    const query = neighborhoodQuery.trim().toLowerCase()
    if (!query) {
      return ACCRA_NEIGHBORHOODS
    }

    return ACCRA_NEIGHBORHOODS.filter((area) => area.toLowerCase().includes(query))
  }, [neighborhoodQuery])

  const handleNeighborhoodSelect = (area: string) => {
    setForm((prev) => ({ ...prev, neighborhood: area }))
    setNeighborhoodQuery(area)
    setIsNeighborhoodOpen(false)
    setErrors((prev) => ({ ...prev, neighborhood: undefined }))
  }

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let localDigits = digits

    if (localDigits.startsWith("233")) {
      localDigits = localDigits.slice(3)
    }
    if (localDigits.startsWith("0")) {
      localDigits = localDigits.slice(1)
    }

    localDigits = localDigits.slice(0, 9)
    setForm((prev) => ({ ...prev, phone: localDigits ? `+233 ${localDigits}` : "+233 " }))
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("This browser does not support geolocation.")
      return
    }

    if (!window.isSecureContext && !isLocalhostHost(window.location.hostname)) {
      setLocationStatus("Location access requires HTTPS (or localhost). Use a secure URL and try again.")
      return
    }

    let permissionDeniedByQuery = false

    try {
      if ("permissions" in navigator && navigator.permissions?.query) {
        const permissionState = await navigator.permissions.query({ name: "geolocation" })
        if (permissionState.state === "denied") {
          permissionDeniedByQuery = true
          setLocationStatus("Browser reports location may be blocked. Trying direct GPS lookup anyway...")
        }
      }
    } catch {
      // Some browsers do not support geolocation permission querying reliably.
    }

    const token = locateTokenRef.current + 1
    locateTokenRef.current = token

    setIsLocating(true)
    setLocationStatus("Getting your GPS coordinates...")

    try {
      let position: GeolocationPosition
      try {
        position = await waitForBestGpsPosition()
      } catch (firstError) {
        const parsedFirstError = parseGeolocationError(firstError)
        const shouldRetryLowAccuracy =
          parsedFirstError.code === 1 ||
          parsedFirstError.code === 2 ||
          parsedFirstError.code === 3 ||
          permissionDeniedByQuery

        if (!shouldRetryLowAccuracy) {
          throw firstError
        }

        setLocationStatus("Retrying location lookup with lower accuracy...")
        position = await getCurrentPositionWithOptions({
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 120000,
        })
      }

      if (locateTokenRef.current !== token) {
        return
      }

      const nextCoordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      const accuracyMeters = Math.round(position.coords.accuracy)
      const canAutofillByPrecision = accuracyMeters <= AUTO_FILL_MAX_ACCURACY_METERS

      setCoordinates(nextCoordinates)
      setGpsAccuracyMeters(accuracyMeters)
      setLocationStatus("Coordinates found. Resolving neighborhood...")

      const reverseResult = await fetchReverseLocation(nextCoordinates).catch(() => ({ neighborhood: null, displayAddress: "" }))

      if (locateTokenRef.current !== token) {
        return
      }

      const statusParts: string[] = [
        `Coordinates: ${toCoordinateLabel(nextCoordinates)} (accuracy: +/-${accuracyMeters}m).`,
      ]

      if (!canAutofillByPrecision) {
        statusParts.push(
          "GPS accuracy is still broad right now. Move to an open area and tap Use Current Location again for better precision.",
        )
      }

      setForm((prev) => ({
        ...prev,
        neighborhood: canAutofillByPrecision && reverseResult.neighborhood ? reverseResult.neighborhood : prev.neighborhood,
      }))

      if (reverseResult.neighborhood && canAutofillByPrecision) {
        setNeighborhoodQuery(reverseResult.neighborhood)
        statusParts.push(`Neighborhood detected: ${reverseResult.neighborhood}.`)
      } else if (reverseResult.neighborhood && !canAutofillByPrecision) {
        statusParts.push(
          `Estimated nearby neighborhood: ${reverseResult.neighborhood}. Please confirm from the list before proceeding.`,
        )
      } else {
        statusParts.push("Neighborhood could not be matched automatically. Please pick it from the list.")
      }

      statusParts.push("Enter your GhanaPost GPS address manually in the field above.")

      if (reverseResult.displayAddress) {
        setResolvedAddress(reverseResult.displayAddress)
      }

      setLocationStatus(statusParts.join(" "))
      setErrors((prev) => ({
        ...prev,
        neighborhood: canAutofillByPrecision && reverseResult.neighborhood ? undefined : prev.neighborhood,
      }))
    } catch (error) {
      if (locateTokenRef.current !== token) {
        return
      }

      const baseErrorMessage = getLocationErrorMessage(error)

      try {
        setLocationStatus(`${baseErrorMessage} Trying approximate network location...`)
        const approximateLocation = await fetchApproximateLocationByIp()

        if (locateTokenRef.current !== token) {
          return
        }

        const approxCoordinates = approximateLocation.coordinates
        setCoordinates(approxCoordinates)
        setGpsAccuracyMeters(null)
        setResolvedAddress(approximateLocation.label)

        const reverseResult = await fetchReverseLocation(approxCoordinates).catch(() => ({ neighborhood: null, displayAddress: "" }))

        if (locateTokenRef.current !== token) {
          return
        }

        const statusParts: string[] = [
          `${baseErrorMessage} Using approximate network coordinates: ${toCoordinateLabel(approxCoordinates)}.`,
        ]

        if (approximateLocation.label) {
          statusParts.push(`Estimated area: ${approximateLocation.label}.`)
        }

        if (approximateLocation.source) {
          statusParts.push(`Approximate source: ${approximateLocation.source}.`)
        }

        if (reverseResult.neighborhood) {
          statusParts.push(
            `Estimated nearby neighborhood: ${reverseResult.neighborhood}. Please select your exact neighborhood manually.`,
          )
        } else {
          statusParts.push("Neighborhood could not be matched automatically. Please pick your exact neighborhood from the list.")
        }

        statusParts.push("Enter your GhanaPost GPS address manually in the field above.")

        if (reverseResult.displayAddress) {
          setResolvedAddress(reverseResult.displayAddress)
        }

        setLocationStatus(statusParts.join(" "))
      } catch {
        setGpsAccuracyMeters(null)
        setLocationStatus(baseErrorMessage)
      }
    } finally {
      if (locateTokenRef.current === token) {
        setIsLocating(false)
      }
    }
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof DeliveryDetailsFormValues, string>> = {}

    if (!ACCRA_NEIGHBORHOODS.includes(form.neighborhood)) {
      nextErrors.neighborhood = "Select an Accra neighborhood from the list."
    }

    if (!form.gpsAddress.trim()) {
      nextErrors.gpsAddress = "GhanaPost GPS address is required."
    }

    if (!form.landmark.trim()) {
      nextErrors.landmark = "Add a house number or landmark."
    }

    const phoneDigits = form.phone.replace(/\D/g, "")
    if (phoneDigits.length !== 12 || !phoneDigits.startsWith("233")) {
      nextErrors.phone = "Use a valid Ghana phone number."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleProceed = () => {
    if (!validateForm()) {
      return
    }

    onProceed({
      neighborhood: form.neighborhood,
      gpsAddress: form.gpsAddress.trim(),
      landmark: form.landmark.trim(),
      phone: form.phone.trim(),
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      coordinateLabel: coordinates ? toCoordinateLabel(coordinates) : undefined,
      resolvedAddress: resolvedAddress || undefined,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
          className="fixed inset-0 z-[10000] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4"
          onClick={onClose}
        >
          <div className={`absolute inset-0 bg-black/50 ${isMobile ? "" : "backdrop-blur-sm"}`} />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-3 sm:my-0 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-details-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-foreground/60 hover:bg-muted hover:text-foreground transition"
              aria-label="Close delivery details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 sm:mb-6 pr-8">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Quick Order</p>
              <h3 id="delivery-details-title" className="text-xl sm:text-2xl font-bold text-foreground">
                Delivery Details
              </h3>
              <p className="text-sm text-foreground/70">
                Tell us exactly where in Accra your order should be delivered.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Neighborhood</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                    <input
                      type="text"
                      value={neighborhoodQuery}
                      onFocus={() => setIsNeighborhoodOpen(true)}
                      onChange={(event) => {
                        setNeighborhoodQuery(event.target.value)
                        setForm((prev) => ({ ...prev, neighborhood: event.target.value }))
                        setIsNeighborhoodOpen(true)
                        setErrors((prev) => ({ ...prev, neighborhood: undefined }))
                      }}
                      onBlur={() => {
                        window.setTimeout(() => setIsNeighborhoodOpen(false), 120)
                      }}
                      className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Search Accra neighborhoods"
                    />
                    {isNeighborhoodOpen && (
                      <div className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
                        {filteredNeighborhoods.length ? (
                          filteredNeighborhoods.map((area) => (
                            <button
                              key={area}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault()
                                handleNeighborhoodSelect(area)
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted/70 transition"
                            >
                              {area}
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-foreground/60">No matching neighborhoods found.</p>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.neighborhood && <p className="mt-1 text-xs text-red-600">{errors.neighborhood}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">GhanaPost GPS Address</label>
                  <input
                    type="text"
                    value={form.gpsAddress}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, gpsAddress: event.target.value }))
                      setErrors((prev) => ({ ...prev, gpsAddress: undefined }))
                    }}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="GL-000-0000"
                  />
                  {errors.gpsAddress && <p className="mt-1 text-xs text-red-600">{errors.gpsAddress}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">House Number / Landmark</label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, landmark: event.target.value }))
                      setErrors((prev) => ({ ...prev, landmark: undefined }))
                    }}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Opposite Zenith Bank"
                  />
                  {errors.landmark && <p className="mt-1 text-xs text-red-600">{errors.landmark}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+233 20 000 0000"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  <span>{isLocating ? "Detecting location..." : "Use Current Location"}</span>
                </button>

                {mapEmbedUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-primary/40 shadow-sm">
                    <iframe
                      title="Detected delivery map"
                      src={mapEmbedUrl}
                      className="h-[180px] sm:h-[230px] w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 p-4 min-h-[170px] sm:min-h-[220px]">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(120,120,120,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.15) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                      }}
                    />

                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background">
                        <MapPin className="h-7 w-7 text-foreground/50" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Map preview appears after location detection</p>
                      <p className="text-xs text-foreground/60">
                        Tap Use Current Location to load your real coordinates and map.
                      </p>
                    </div>
                  </div>
                )}

                {coordinates && (
                  <div className="rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground/70">
                    <p className="font-semibold text-foreground">Coordinates</p>
                    <p>{coordinateLabel}</p>
                    {gpsAccuracyMeters !== null && <p className="mt-1">Accuracy: +/-{gpsAccuracyMeters}m</p>}
                    {resolvedAddress && <p className="mt-1 line-clamp-2">{resolvedAddress}</p>}
                  </div>
                )}

                <p className="min-h-5 text-xs text-foreground/60">{locationStatus}</p>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3 pb-1">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70 transition"
              >
                Back to Summary
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
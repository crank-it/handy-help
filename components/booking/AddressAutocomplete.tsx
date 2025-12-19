'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Input } from '@/components/ui/Input'

// Dunedin bounds for biasing results to service area
const DUNEDIN_BOUNDS = {
  north: -45.8,
  south: -45.95,
  east: 170.6,
  west: 170.4,
}

// Service area suburbs (can be expanded)
const SERVICE_SUBURBS = [
  'Roslyn',
  'Maori Hill',
  'Mornington',
  'Kaikorai Valley',
  'City Centre',
  'North Dunedin',
  'South Dunedin',
  'St Kilda',
  'Andersons Bay',
  'Musselburgh',
  'Caversham',
  'Belleknowes',
  'Green Island',
  'Abbotsford',
  'Pine Hill',
  'Ravensbourne',
  'Dunedin',
]

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  onSuburbExtracted?: (suburb: string) => void
  error?: string
  required?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  onSuburbExtracted,
  error,
  required = true,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [warning, setWarning] = useState<string>('')

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.error('Google Maps API key not found')
      return
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    })

    loader
      .load()
      .then(() => {
        setIsLoaded(true)

        if (!inputRef.current) return

        // Initialize autocomplete
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: 'nz' },
            bounds: {
              north: DUNEDIN_BOUNDS.north,
              south: DUNEDIN_BOUNDS.south,
              east: DUNEDIN_BOUNDS.east,
              west: DUNEDIN_BOUNDS.west,
            },
            fields: ['address_components', 'formatted_address', 'geometry'],
            types: ['address'],
          }
        )

        autocompleteRef.current = autocomplete

        // Listen for place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()

          if (!place.formatted_address) {
            return
          }

          // Update address value
          onChange(place.formatted_address)

          // Extract suburb from address components
          const addressComponents = place.address_components || []
          let suburb = ''

          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              suburb = component.long_name
              break
            }
            if (component.types.includes('sublocality')) {
              suburb = component.long_name
              break
            }
          }

          // Validate service area
          const isInServiceArea = validateServiceArea(place, suburb)
          if (!isInServiceArea) {
            setWarning(
              'This address may be outside our service area. Book anyway and we\'ll confirm availability.'
            )
          } else {
            setWarning('')
          }

          // Call callbacks
          if (suburb && onSuburbExtracted) {
            onSuburbExtracted(suburb)
          }
          if (onPlaceSelect) {
            onPlaceSelect(place)
          }
        })
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error)
      })

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange, onPlaceSelect, onSuburbExtracted])

  // Validate if address is within service area
  const validateServiceArea = (
    place: google.maps.places.PlaceResult,
    suburb: string
  ): boolean => {
    // Check if suburb is in our service list
    if (suburb && SERVICE_SUBURBS.includes(suburb)) {
      return true
    }

    // Check if location is within Dunedin bounds
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      if (
        lat >= DUNEDIN_BOUNDS.south &&
        lat <= DUNEDIN_BOUNDS.north &&
        lng >= DUNEDIN_BOUNDS.west &&
        lng <= DUNEDIN_BOUNDS.east
      ) {
        return true
      }
    }

    return false
  }

  return (
    <div>
      <Input
        ref={inputRef}
        label="Street Address"
        placeholder="Start typing your address..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        required={required}
        helperText={
          isLoaded
            ? 'We service Dunedin and surrounding suburbs'
            : 'Loading address autocomplete...'
        }
      />

      {warning && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{warning}</p>
        </div>
      )}
    </div>
  )
}

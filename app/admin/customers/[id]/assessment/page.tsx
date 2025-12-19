'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Camera, Save, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { AssessmentPhoto } from '@/types'

export default function PropertyAssessmentPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Access & Entry
  const [hasGateCode, setHasGateCode] = useState<'no' | 'yes'>('no')
  const [accessGateCode, setAccessGateCode] = useState('')
  const [hasKey, setHasKey] = useState<'no' | 'yes'>('no')
  const [accessKeyLocation, setAccessKeyLocation] = useState('')
  const [parkingType, setParkingType] = useState<'driveway' | 'street' | 'other' | ''>('')
  const [accessParkingSpot, setAccessParkingSpot] = useState('')
  const [entryPoint, setEntryPoint] = useState<'front_gate' | 'side_gate' | 'back_gate' | 'other' | ''>('')
  const [accessEntryPoint, setAccessEntryPoint] = useState('')
  const [lockType, setLockType] = useState<'none' | 'padlock' | 'combination' | 'sliding_bolt' | 'other' | ''>('')
  const [accessLockType, setAccessLockType] = useState('')
  const [accessNotes, setAccessNotes] = useState('')

  // Lawn Assessment
  const [lawnBoundariesClear, setLawnBoundariesClear] = useState(false)
  const [hasIrrigation, setHasIrrigation] = useState<'no' | 'yes'>('no')
  const [lawnIrrigation, setLawnIrrigation] = useState('')
  const [lawnSlopesNoted, setLawnSlopesNoted] = useState(false)
  const [lawnCondition, setLawnCondition] = useState<
    'excellent' | 'good' | 'fair' | 'poor' | ''
  >('')

  // Obstacles & Hazards
  const [hasHeavyObjects, setHasHeavyObjects] = useState<'no' | 'yes'>('no')
  const [heavyObjects, setHeavyObjects] = useState('')
  const [hasFixedObstacles, setHasFixedObstacles] = useState<'no' | 'yes'>('no')
  const [fixedObstacles, setFixedObstacles] = useState('')
  const [hasHazards, setHasHazards] = useState<'no' | 'yes'>('no')
  const [hazards, setHazards] = useState('')
  const [hasPets, setHasPets] = useState<'no' | 'yes'>('no')
  const [petConsiderations, setPetConsiderations] = useState('')
  const [movingInstructions, setMovingInstructions] = useState('')

  // Areas to Avoid
  const [hasGardenBeds, setHasGardenBeds] = useState<'no' | 'yes'>('no')
  const [gardenBeds, setGardenBeds] = useState('')
  const [hasDelicatePlants, setHasDelicatePlants] = useState<'no' | 'yes'>('no')
  const [delicatePlants, setDelicatePlants] = useState('')
  const [hasNoMowZones, setHasNoMowZones] = useState<'no' | 'yes'>('no')
  const [noMowZones, setNoMowZones] = useState('')
  const [hasSprinklers, setHasSprinklers] = useState<'no' | 'yes'>('no')
  const [sprinklerLocations, setSprinklerLocations] = useState('')

  // Service Requirements
  const [clippingDisposal, setClippingDisposal] = useState<
    'compost' | 'green_bin' | 'take_away' | 'leave' | ''
  >('')
  const [equipmentNeeded, setEquipmentNeeded] = useState<{
    trimmer: boolean
    edger: boolean
    blower: boolean
    rake: boolean
  }>({
    trimmer: false,
    edger: false,
    blower: false,
    rake: false,
  })
  const [specialRequests, setSpecialRequests] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  // Photos
  const [photos, setPhotos] = useState<AssessmentPhoto[]>([])

  // General notes
  const [generalNotes, setGeneralNotes] = useState('')

  // Proposal Recommendations
  const [recommendedLawnSize, setRecommendedLawnSize] = useState<'small' | 'medium' | 'large' | ''>('')
  const [recommendedPackage, setRecommendedPackage] = useState<'standard' | 'premium' | ''>('')
  const [visitFrequency, setVisitFrequency] = useState('')
  const [pricePerVisit, setPricePerVisit] = useState('')
  const [includedServices, setIncludedServices] = useState<{
    lawn_clearing: boolean
    edge_trimming: boolean
    hedging: boolean
  }>({
    lawn_clearing: true,
    edge_trimming: true,
    hedging: false,
  })
  const [proposalNotes, setProposalNotes] = useState('')
  const [isCreatingProposal, setIsCreatingProposal] = useState(false)

  const handlePhotoCapture = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: AssessmentPhoto['category']
  ) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPhoto: AssessmentPhoto = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          category,
          timestamp: new Date().toISOString(),
        }
        setPhotos((prev) => [...prev, newPhoto])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

  const handleCreateProposal = async () => {
    // Validate proposal fields
    if (!recommendedLawnSize || !recommendedPackage || !visitFrequency || !pricePerVisit) {
      alert('Please fill in all proposal fields')
      return
    }

    setIsCreatingProposal(true)

    try {
      // Calculate estimated annual visits
      const frequency = parseInt(visitFrequency)
      const estimatedAnnualVisits = Math.floor(365 / frequency)

      // Build included services array
      const servicesArray = Object.entries(includedServices)
        .filter(([, included]) => included)
        .map(([service]) => service)

      // Create proposal
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: params.id,
          lawnSize: recommendedLawnSize,
          packageType: recommendedPackage,
          visitFrequencyDays: frequency,
          pricePerVisitCents: Math.round(parseFloat(pricePerVisit) * 100),
          estimatedAnnualVisits,
          includedServices: servicesArray,
          notes: proposalNotes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create proposal')
      }

      const data = await response.json()

      alert(`Proposal created successfully!\n\nProposal URL:\n${data.proposalUrl}\n\nSend this link to the customer via WhatsApp or email.`)

      // Optionally redirect to customer page
      router.push(`/admin/customers/${params.id}`)
    } catch (error) {
      console.error('Error creating proposal:', error)
      alert('Failed to create proposal. Please try again.')
    } finally {
      setIsCreatingProposal(false)
    }
  }

  const handleSaveAssessment = async () => {
    setIsSaving(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assessmentData = {
      customer_id: params.id,
      access_gate_code: hasGateCode === 'yes' ? accessGateCode : undefined,
      access_key_location: hasKey === 'yes' ? accessKeyLocation : undefined,
      access_parking_spot: parkingType === 'other' ? accessParkingSpot : parkingType,
      access_entry_point: entryPoint === 'other' ? accessEntryPoint : entryPoint,
      access_lock_type: lockType === 'other' ? accessLockType : lockType,
      access_notes: accessNotes,
      lawn_boundaries_clear: lawnBoundariesClear,
      lawn_irrigation_location: hasIrrigation === 'yes' ? lawnIrrigation : undefined,
      lawn_slopes_noted: lawnSlopesNoted,
      lawn_condition: lawnCondition || undefined,
      obstacles_heavy_objects: hasHeavyObjects === 'yes' ? heavyObjects.split(',').filter(Boolean) : [],
      obstacles_fixed: hasFixedObstacles === 'yes' ? fixedObstacles.split(',').filter(Boolean) : [],
      obstacles_hazards: hasHazards === 'yes' ? hazards.split(',').filter(Boolean) : [],
      obstacles_pet_considerations: hasPets === 'yes' ? petConsiderations : undefined,
      obstacles_moving_instructions: movingInstructions,
      avoid_garden_beds: hasGardenBeds === 'yes' ? gardenBeds.split(',').filter(Boolean) : [],
      avoid_delicate_plants: hasDelicatePlants === 'yes' ? delicatePlants.split(',').filter(Boolean) : [],
      avoid_no_mow_zones: hasNoMowZones === 'yes' ? noMowZones.split(',').filter(Boolean) : [],
      avoid_sprinkler_locations: hasSprinklers === 'yes' ? sprinklerLocations.split(',').filter(Boolean) : [],
      service_clipping_disposal: clippingDisposal,
      service_equipment_needed: Object.entries(equipmentNeeded)
        .filter(([, checked]) => checked)
        .map(([key]) => key),
      service_special_requests: specialRequests,
      service_estimated_time: estimatedTime ? parseInt(estimatedTime) : undefined,
      photos,
      assessed_by: 'William Carter',
      assessed_at: new Date().toISOString(),
      notes: generalNotes,
    }

    console.log('Assessment data:', assessmentData)

    setIsSaving(false)
    router.push(`/admin/customers/${params.id}`)
  }

  return (
    <div className="pb-8">
      <Link
        href={`/admin/customers/${params.id}`}
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-semibold mb-6"
      >
        <ArrowLeft size={20} />
        Back to Customer
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Property Assessment
        </h1>
        <p className="text-text-secondary">
          Complete this checklist on your first visit
        </p>
      </div>

      {/* Access & Entry */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Access & Entry
        </h2>

        <div className="space-y-4">
          {/* Gate Code */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Gate Code / Entry Code
            </label>
            <select
              value={hasGateCode}
              onChange={(e) => setHasGateCode(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">No gate code</option>
              <option value="yes">Has gate code</option>
            </select>
            {hasGateCode === 'yes' && (
              <Input
                value={accessGateCode}
                onChange={(e) => setAccessGateCode(e.target.value)}
                placeholder="e.g., #1234"
                className="mt-2"
              />
            )}
          </div>

          {/* Key Location */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Key Location
            </label>
            <select
              value={hasKey}
              onChange={(e) => setHasKey(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">No key needed</option>
              <option value="yes">Key required</option>
            </select>
            {hasKey === 'yes' && (
              <Input
                value={accessKeyLocation}
                onChange={(e) => setAccessKeyLocation(e.target.value)}
                placeholder="e.g., Under front mat, with neighbor"
                className="mt-2"
              />
            )}
          </div>

          {/* Parking */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Parking
            </label>
            <select
              value={parkingType}
              onChange={(e) => setParkingType(e.target.value as 'driveway' | 'street' | 'other' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select parking type</option>
              <option value="driveway">Driveway</option>
              <option value="street">Street parking</option>
              <option value="other">Other</option>
            </select>
            {parkingType === 'other' && (
              <Input
                value={accessParkingSpot}
                onChange={(e) => setAccessParkingSpot(e.target.value)}
                placeholder="Describe parking location"
                className="mt-2"
              />
            )}
          </div>

          {/* Entry Point */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Best Entry Point
            </label>
            <select
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value as 'front_gate' | 'side_gate' | 'back_gate' | 'other' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select entry point</option>
              <option value="front_gate">Front gate</option>
              <option value="side_gate">Side gate</option>
              <option value="back_gate">Back gate</option>
              <option value="other">Other</option>
            </select>
            {entryPoint === 'other' && (
              <Input
                value={accessEntryPoint}
                onChange={(e) => setAccessEntryPoint(e.target.value)}
                placeholder="Describe entry point"
                className="mt-2"
              />
            )}
          </div>

          {/* Lock Type */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Lock/Latch Type
            </label>
            <select
              value={lockType}
              onChange={(e) => setLockType(e.target.value as 'none' | 'padlock' | 'combination' | 'sliding_bolt' | 'other' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select lock type</option>
              <option value="none">No lock</option>
              <option value="padlock">Padlock</option>
              <option value="combination">Combination lock</option>
              <option value="sliding_bolt">Sliding bolt</option>
              <option value="other">Other</option>
            </select>
            {lockType === 'other' && (
              <Input
                value={accessLockType}
                onChange={(e) => setAccessLockType(e.target.value)}
                placeholder="Describe lock type"
                className="mt-2"
              />
            )}
          </div>

          <Textarea
            label="Access Notes"
            value={accessNotes}
            onChange={(e) => setAccessNotes(e.target.value)}
            placeholder="Any other access information..."
            rows={3}
          />

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Entry Point Photo
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handlePhotoCapture(e, 'entry')}
              className="block w-full text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-secondary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Lawn Assessment */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Lawn Assessment
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 bg-bg-muted rounded-lg cursor-pointer hover:bg-brand-primary/5 transition-colors">
            <input
              type="checkbox"
              checked={lawnBoundariesClear}
              onChange={(e) => setLawnBoundariesClear(e.target.checked)}
              className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
            />
            <span className="font-semibold text-text-primary">
              Lawn boundaries are clear
            </span>
          </label>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Irrigation System
            </label>
            <select
              value={hasIrrigation}
              onChange={(e) => setHasIrrigation(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">No irrigation system</option>
              <option value="yes">Has irrigation</option>
            </select>
            {hasIrrigation === 'yes' && (
              <Input
                value={lawnIrrigation}
                onChange={(e) => setLawnIrrigation(e.target.value)}
                placeholder="e.g., Sprinklers on north side, drip system in beds"
                className="mt-2"
              />
            )}
          </div>

          <label className="flex items-center gap-3 p-3 bg-bg-muted rounded-lg cursor-pointer hover:bg-brand-primary/5 transition-colors">
            <input
              type="checkbox"
              checked={lawnSlopesNoted}
              onChange={(e) => setLawnSlopesNoted(e.target.checked)}
              className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
            />
            <span className="font-semibold text-text-primary">
              Slopes/uneven areas noted
            </span>
          </label>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Current Lawn Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['excellent', 'good', 'fair', 'poor'] as const).map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setLawnCondition(condition)}
                  className={`p-3 rounded-lg border-2 font-semibold capitalize transition-all ${
                    lawnCondition === condition
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-border bg-white text-text-primary hover:border-brand-primary'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Overview Photos (4 corners recommended)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => handlePhotoCapture(e, 'overview')}
              className="block w-full text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-secondary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Obstacles & Hazards */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Obstacles & Hazards
        </h2>

        <div className="space-y-4">
          {/* Heavy Objects */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Heavy Objects to Move
            </label>
            <select
              value={hasHeavyObjects}
              onChange={(e) => setHasHeavyObjects(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has heavy objects</option>
            </select>
            {hasHeavyObjects === 'yes' && (
              <Textarea
                value={heavyObjects}
                onChange={(e) => setHeavyObjects(e.target.value)}
                placeholder="e.g., Outdoor furniture, potted plants, toys"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* Fixed Obstacles */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Fixed Obstacles
            </label>
            <select
              value={hasFixedObstacles}
              onChange={(e) => setHasFixedObstacles(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has fixed obstacles</option>
            </select>
            {hasFixedObstacles === 'yes' && (
              <Textarea
                value={fixedObstacles}
                onChange={(e) => setFixedObstacles(e.target.value)}
                placeholder="e.g., Trees, posts, garden beds, clothes line"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* Hazards */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Hazards Identified
            </label>
            <select
              value={hasHazards}
              onChange={(e) => setHasHazards(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has hazards</option>
            </select>
            {hasHazards === 'yes' && (
              <Textarea
                value={hazards}
                onChange={(e) => setHazards(e.target.value)}
                placeholder="e.g., Holes, rocks, hidden stumps, steep drops"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* Pet Considerations */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Pet Considerations
            </label>
            <select
              value={hasPets}
              onChange={(e) => setHasPets(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">No pets</option>
              <option value="yes">Has pets</option>
            </select>
            {hasPets === 'yes' && (
              <Input
                value={petConsiderations}
                onChange={(e) => setPetConsiderations(e.target.value)}
                placeholder="e.g., Dog in backyard on weekdays, cat door on side"
                className="mt-2"
              />
            )}
          </div>

          <Textarea
            label="Moving Instructions"
            value={movingInstructions}
            onChange={(e) => setMovingInstructions(e.target.value)}
            placeholder="Special instructions for moving objects..."
            rows={3}
          />

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Obstacle Photos
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => handlePhotoCapture(e, 'obstacles')}
              className="block w-full text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-secondary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Areas to Avoid */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Areas to Avoid
        </h2>

        <div className="space-y-4">
          {/* Garden Beds */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Garden Beds
            </label>
            <select
              value={hasGardenBeds}
              onChange={(e) => setHasGardenBeds(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has garden beds</option>
            </select>
            {hasGardenBeds === 'yes' && (
              <Textarea
                value={gardenBeds}
                onChange={(e) => setGardenBeds(e.target.value)}
                placeholder="e.g., Rose bed near fence, vegetable garden back corner"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* Delicate Plants */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Delicate Plants
            </label>
            <select
              value={hasDelicatePlants}
              onChange={(e) => setHasDelicatePlants(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has delicate plants</option>
            </select>
            {hasDelicatePlants === 'yes' && (
              <Textarea
                value={delicatePlants}
                onChange={(e) => setDelicatePlants(e.target.value)}
                placeholder="e.g., Young trees, seedlings, flowering plants"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* No-Mow Zones */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              No-Mow Zones
            </label>
            <select
              value={hasNoMowZones}
              onChange={(e) => setHasNoMowZones(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has no-mow zones</option>
            </select>
            {hasNoMowZones === 'yes' && (
              <Textarea
                value={noMowZones}
                onChange={(e) => setNoMowZones(e.target.value)}
                placeholder="e.g., Wildflower patch, natural area by shed"
                helperText="Comma separated"
                rows={2}
                className="mt-2"
              />
            )}
          </div>

          {/* Sprinkler Heads */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Sprinkler Heads
            </label>
            <select
              value={hasSprinklers}
              onChange={(e) => setHasSprinklers(e.target.value as 'no' | 'yes')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="no">None</option>
              <option value="yes">Has sprinkler heads</option>
            </select>
            {hasSprinklers === 'yes' && (
              <Input
                value={sprinklerLocations}
                onChange={(e) => setSprinklerLocations(e.target.value)}
                placeholder="Note where sprinkler heads are located"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Garden/Avoid Area Photos
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => handlePhotoCapture(e, 'avoid_areas')}
              className="block w-full text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-secondary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Service Requirements */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Service Requirements
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Clipping Disposal Method
            </label>
            <select
              value={clippingDisposal}
              onChange={(e) => setClippingDisposal(e.target.value as 'compost' | 'green_bin' | 'take_away' | 'leave' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select disposal method</option>
              <option value="compost">Compost Bin</option>
              <option value="green_bin">Green Bin</option>
              <option value="take_away">Take Away</option>
              <option value="leave">Leave on Lawn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Equipment Needed
            </label>
            <div className="space-y-2">
              {Object.entries({
                trimmer: 'Line Trimmer',
                edger: 'Edger',
                blower: 'Blower',
                rake: 'Rake',
              }).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 bg-bg-muted rounded-lg cursor-pointer hover:bg-brand-primary/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      equipmentNeeded[key as keyof typeof equipmentNeeded]
                    }
                    onChange={(e) =>
                      setEquipmentNeeded((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                  />
                  <span className="font-semibold text-text-primary">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Textarea
            label="Special Requests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special customer requests or preferences..."
            rows={3}
          />

          <Input
            label="Estimated Time (minutes)"
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g., 45"
            helperText="Your estimated time for this property"
          />
        </div>
      </Card>

      {/* Photos Summary */}
      {photos.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Camera size={24} />
            Photos Captured ({photos.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-lg overflow-hidden border-2 border-border"
              >
                <Image
                  src={photo.url}
                  alt={photo.category}
                  width={200}
                  height={128}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1 capitalize">
                  {photo.category.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* General Notes */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          General Notes
        </h2>
        <Textarea
          label="Additional Observations"
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder="Any other important information about this property..."
          rows={4}
        />
      </Card>

      {/* Proposal Recommendations */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <h2 className="text-xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} />
          Proposal Recommendations
        </h2>

        <div className="space-y-4">
          {/* Lawn Size */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Recommended Lawn Size
            </label>
            <select
              value={recommendedLawnSize}
              onChange={(e) => setRecommendedLawnSize(e.target.value as 'small' | 'medium' | 'large' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select lawn size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Recommended Package
            </label>
            <select
              value={recommendedPackage}
              onChange={(e) => setRecommendedPackage(e.target.value as 'standard' | 'premium' | '')}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select package</option>
              <option value="standard">Standard (every 4 weeks)</option>
              <option value="premium">Premium (every 2 weeks)</option>
            </select>
          </div>

          {/* Visit Frequency */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Visit Frequency (days)
            </label>
            <select
              value={visitFrequency}
              onChange={(e) => setVisitFrequency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
            >
              <option value="">Select frequency</option>
              <option value="14">Every 14 days (2 weeks)</option>
              <option value="21">Every 21 days (3 weeks)</option>
              <option value="28">Every 28 days (4 weeks)</option>
            </select>
          </div>

          {/* Price Per Visit */}
          <Input
            label="Price Per Visit ($)"
            type="number"
            step="0.01"
            value={pricePerVisit}
            onChange={(e) => setPricePerVisit(e.target.value)}
            placeholder="e.g., 65.00"
            helperText="Enter the price in dollars (e.g., 65.00)"
          />

          {/* Included Services */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Services Included in Proposal
            </label>
            <div className="space-y-2">
              {Object.entries({
                lawn_clearing: 'Lawn Clearing',
                edge_trimming: 'Edge Trimming',
                hedging: 'Hedging',
              }).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-brand-primary/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={includedServices[key as keyof typeof includedServices]}
                    onChange={(e) =>
                      setIncludedServices((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                  />
                  <span className="font-semibold text-text-primary">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Proposal Notes */}
          <Textarea
            label="Proposal Notes"
            value={proposalNotes}
            onChange={(e) => setProposalNotes(e.target.value)}
            placeholder="Any additional notes or special conditions for this proposal..."
            rows={3}
          />

          {/* Generate Proposal Button */}
          <div className="pt-4 border-t border-blue-300">
            <Button
              variant="primary"
              onClick={handleCreateProposal}
              isLoading={isCreatingProposal}
              className="w-full"
              size="lg"
            >
              Generate & Send Proposal
            </Button>
            <p className="text-sm text-text-secondary mt-2 text-center">
              This will create a proposal and provide you with a link to send to the customer
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/admin/customers/${params.id}`)}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleSaveAssessment}
          isLoading={isSaving}
        >
          <Save size={20} />
          Save Assessment
        </Button>
      </div>
    </div>
  )
}

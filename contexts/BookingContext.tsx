'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BookingData } from '@/types'

interface BookingContextType {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  clearBookingData: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const STORAGE_KEY = 'handy-help-booking'

const initialBookingData: BookingData = {
  address: '',
  suburb: '',
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setBookingData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse booking data:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever booking data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData))
    }
  }, [bookingData, isLoaded])

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const clearBookingData = () => {
    setBookingData(initialBookingData)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

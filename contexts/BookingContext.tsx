'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BookingData {
  address?: string
  suburb?: string
  lawnSize?: 'small' | 'medium' | 'large'
  packageType?: 'standard' | 'premium'
  name?: string
  email?: string
  phone?: string
  preferredTime?: 'morning' | 'afternoon'
  notes?: string
}

interface BookingContextType {
  bookingData: BookingData
  setBookingData: (data: Partial<BookingData>) => void
  resetBooking: () => void
}

const initialBookingData: BookingData = {}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingDataState] = useState<BookingData>(initialBookingData)

  const setBookingData = (data: Partial<BookingData>) => {
    setBookingDataState((prev) => ({ ...prev, ...data }))
  }

  const resetBooking = () => {
    setBookingDataState(initialBookingData)
  }

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData, resetBooking }}>
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


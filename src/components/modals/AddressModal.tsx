"use client"

import type React from "react"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (address: string) => void
}

export const AddressModal=({ isOpen, onClose, onAdd }: AddressModalProps)=> {
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [region, setRegion] = useState("")
  const [comuna, setComuna] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (street && number) {
      const fullAddress = `${street} ${number}, ${comuna}, ${region}`
      onAdd(fullAddress)
      setStreet("")
      setNumber("")
      setRegion("")
      setComuna("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            Agregar Dirección
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
          
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Nombre de la calle"
              required
            />
          </div>
         
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QtyStepperProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
}

export function QtyStepper({ quantity, onDecrease, onIncrease }: QtyStepperProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onDecrease}
        size="sm"
        className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-0"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <span className="w-8 text-center font-semibold text-amber-900">{quantity}</span>

      <Button
        onClick={onIncrease}
        size="sm"
        className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}

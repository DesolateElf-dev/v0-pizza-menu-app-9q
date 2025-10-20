"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, Product } from "@/types"

interface CartState {
  items: CartItem[]
  total: number
}

interface CartContextType extends CartState {
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantidade: number) => void
  clear: () => void
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantidade: number } }
  | { type: "CLEAR" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartItem[] }

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload
      
      // Usar apenas o ID original da pizza (sem concatenar nada)
      const itemId = product.id
      const existingItem = state.items.find((item) => item.id === itemId)

      let newItems: CartItem[]

      if (existingItem) {
        // Se o item já existe, incrementar quantidade
        newItems = state.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                subtotal: item.precoUnit * (item.quantidade + 1),
              }
            : item,
        )
      } else {
        // Criar novo item (preço único - usar precoMedia)
        const newItem: CartItem = {
          id: itemId,
          nome: product.nome,
          imagem: product.imagem,
          precoUnit: product.precoMedia, // Preço único
          quantidade: 1,
          subtotal: product.precoMedia,
        }
        newItems = [...state.items, newItem]
      }

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0)
      return { items: newItems, total }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0)
      return { items: newItems, total }
    }

    case "UPDATE_QTY": {
      const { id, quantidade } = action.payload

      if (quantidade <= 0) {
        const newItems = state.items.filter((item) => item.id !== id)
        const total = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        return { items: newItems, total }
      }

      const newItems = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade,
              subtotal: item.precoUnit * quantidade,
            }
          : item,
      )

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0)
      return { items: newItems, total }
    }

    case "CLEAR": {
      return { items: [], total: 0 }
    }

    case "LOAD_FROM_STORAGE": {
      const items = action.payload
      const total = items.reduce((sum, item) => sum + item.subtotal, 0)
      return { items, total }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pizzaria-cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_FROM_STORAGE", payload: items })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pizzaria-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQty = (id: string, quantidade: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, quantidade } })
  }

  const clear = () => {
    dispatch({ type: "CLEAR" })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
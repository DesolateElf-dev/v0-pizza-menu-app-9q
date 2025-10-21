"use client"

import React, { createContext, useContext, useEffect, useReducer } from 'react'

// Tipos do carrinho sem tamanhos e com suporte a 3 categorias
export type CartItemType = 'pizza' | 'pizzaDoce' | 'bebida'

export interface CartItem {
  id: string // id do produto (pizza/pizzaDoce/bebida)
  type: CartItemType
  nome: string
  imagem?: string | null
  precoUnit: number
  quantidade: number
  subtotal: number
}

interface CartState {
  items: CartItem[]
  total: number
}

interface AddItemInput {
  id: string
  type: CartItemType
  nome: string
  imagem?: string | null
  precoUnit: number
}

interface CartContextType extends CartState {
  addItem: (input: AddItemInput) => void
  removeItem: (id: string, type: CartItemType) => void
  updateQty: (id: string, type: CartItemType, quantidade: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helpers
const storageKey = 'pizzaria-cart-v2'

function calcTotal(items: CartItem[]): number {
  return items.reduce((acc, it) => acc + it.subtotal, 0)
}

function itemKey(id: string, type: CartItemType) {
  return `${type}:${id}`
}

// Reducer

type CartAction =
  | { type: 'ADD_ITEM'; payload: AddItemInput }
  | { type: 'REMOVE_ITEM'; payload: { id: string; type: CartItemType } }
  | { type: 'UPDATE_QTY'; payload: { id: string; type: CartItemType; quantidade: number } }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD': {
      const items = action.payload
      return { items, total: calcTotal(items) }
    }
    case 'ADD_ITEM': {
      const { id, type, nome, imagem, precoUnit } = action.payload
      const key = itemKey(id, type)
      const existingIndex = state.items.findIndex((it) => itemKey(it.id, it.type) === key)

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = state.items.map((it, idx) =>
          idx === existingIndex
            ? { ...it, quantidade: it.quantidade + 1, subtotal: (it.quantidade + 1) * it.precoUnit }
            : it
        )
      } else {
        const next: CartItem = {
          id,
          type,
          nome,
          imagem: imagem ?? undefined,
          precoUnit,
          quantidade: 1,
          subtotal: precoUnit,
        }
        newItems = [...state.items, next]
      }
      return { items: newItems, total: calcTotal(newItems) }
    }
    case 'UPDATE_QTY': {
      const { id, type, quantidade } = action.payload
      const key = itemKey(id, type)
      let newItems = state.items
        .map((it) => (itemKey(it.id, it.type) === key ? { ...it, quantidade, subtotal: Math.max(0, quantidade) * it.precoUnit } : it))
        .filter((it) => it.quantidade > 0)
      return { items: newItems, total: calcTotal(newItems) }
    }
    case 'REMOVE_ITEM': {
      const { id, type } = action.payload
      const key = itemKey(id, type)
      const newItems = state.items.filter((it) => itemKey(it.id, it.type) !== key)
      return { items: newItems, total: calcTotal(newItems) }
    }
    case 'CLEAR': {
      return { items: [], total: 0 }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // carregar do storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const items: CartItem[] = JSON.parse(raw)
        dispatch({ type: 'LOAD', payload: items })
      }
    } catch (e) {
      console.warn('Falha ao carregar carrinho do storage', e)
    }
  }, [])

  // persistir no storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.items))
    } catch (e) {
      console.warn('Falha ao salvar carrinho no storage', e)
    }
  }, [state.items])

  const addItem = (input: AddItemInput) => dispatch({ type: 'ADD_ITEM', payload: input })
  const removeItem = (id: string, type: CartItemType) => dispatch({ type: 'REMOVE_ITEM', payload: { id, type } })
  const updateQty = (id: string, type: CartItemType, quantidade: number) => dispatch({ type: 'UPDATE_QTY', payload: { id, type, quantidade } })
  const clear = () => dispatch({ type: 'CLEAR' })

  const value: CartContextType = {
    items: state.items,
    total: state.total,
    addItem,
    removeItem,
    updateQty,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

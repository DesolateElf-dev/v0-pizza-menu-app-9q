export interface Product {
  id: string
  nome: string
  descricao: string
  precoGrande: number
  precoMedia: number
  imagem: string
  categoria: "PIZZAS" | "DOCES" | "BEBIDAS"
  tamanhos?: Record<string, number>
}

export interface CartItem {
  id: string
  nome: string
  imagem: string
  precoUnit: number
  quantidade: number
  subtotal: number
}

export type TabType = "PIZZAS" | "DOCES" | "BEBIDAS"

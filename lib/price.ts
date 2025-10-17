export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function calcSubtotal(precoUnit: number, quantidade: number): number {
  return precoUnit * quantidade
}

export function formatPrice(value: number): string {
  return `R$${value.toFixed(2).replace(".", ",")}`
}

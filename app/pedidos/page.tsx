import { Header } from '@/components/header'
import { listUserOrders } from '@/app/actions/orders-actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

function formatCurrency(v?: any) {
  if (v == null) return 'R$ 0,00'
  const num = typeof v === 'string' ? Number(v) : Number(v)
  if (Number.isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

export default async function PedidosPage({ searchParams }: { searchParams: { status?: string; from?: string; to?: string; page?: string } }) {
  const status = searchParams.status as any | undefined
  const from = searchParams.from
  const to = searchParams.to
  const page = searchParams.page ? Number(searchParams.page) : 1

  const { items, total, pageSize } = await listUserOrders({ status, from, to, page })
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-amber-900">Meus Pedidos</h1>
          <Link href="/menu" className="text-amber-700 hover:text-amber-900 underline">← Voltar ao cardápio</Link>
        </div>

        {/* Filtros simples */}
        <form className="bg-white rounded-2xl border border-amber-200 p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <select name="status" defaultValue={status || ''} className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
            <option value="">Todos os status</option>
            <option value="Recebido">Recebido</option>
            <option value="Preparando">Preparando</option>
            <option value="Saiu para entrega">Saiu para entrega</option>
            <option value="Entregue">Entregue</option>
          </select>
          <input type="date" name="from" defaultValue={from} className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900" />
          <input type="date" name="to" defaultValue={to} className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900" />
          <button className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold">Filtrar</button>
        </form>

        {/* Lista de pedidos */}
        {items.length === 0 ? (
          <p className="text-amber-700">Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-4">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow p-4 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700">#{p.id.slice(0,6).toUpperCase()}</p>
                    <p className="text-amber-900 font-semibold">
                      {format(new Date(p.dataPedido), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                      p.status === 'Preparando' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'Saiu para entrega' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-200 text-amber-900'
                    }`}>
                      {p.status}
                    </span>
                    <p className="text-amber-900 font-bold mt-1">{formatCurrency(p.valorTotal)}</p>
                  </div>
                </div>
                <div className="mt-3 text-amber-800 text-sm">
                  {p.itens.map((it) => (
                    <div key={it.id} className="flex items-center justify-between py-1">
                      <span>{it.quantidade}x {it.pizza.sabor} ({it.tamanho})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-amber-700">Página {page} de {totalPages}</div>
          <div className="flex gap-2">
            <Link href={{ pathname: '/pedidos', query: { status, from, to, page: Math.max(1, page - 1) } }} className="px-3 py-2 rounded-xl bg-amber-200 text-amber-900 hover:bg-amber-300">
              Anterior
            </Link>
            <Link href={{ pathname: '/pedidos', query: { status, from, to, page: Math.min(totalPages, page + 1) } }} className="px-3 py-2 rounded-xl bg-amber-200 text-amber-900 hover:bg-amber-300">
              Próxima
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Transaction } from '../contexts/TransactionsContext'

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    description: 'Salário',
    price: 4500,
    category: 'Trabalho',
    type: 'income',
    createdAt: '2024-10-15T08:00:00.000Z',
  },
  {
    id: 2,
    description: 'Freelance desenvolvimento',
    price: 1200,
    category: 'Trabalho',
    type: 'income',
    createdAt: '2024-10-12T14:30:00.000Z',
  },
  {
    id: 3,
    description: 'Rendimento investimentos',
    price: 180,
    category: 'Investimentos',
    type: 'income',
    createdAt: '2024-10-10T09:15:00.000Z',
  },
  {
    id: 4,
    description: 'Venda de produto usado',
    price: 350,
    category: 'Vendas',
    type: 'income',
    createdAt: '2024-10-08T16:45:00.000Z',
  },
  {
    id: 5,
    description: 'Cashback cartão',
    price: 45,
    category: 'Benefícios',
    type: 'income',
    createdAt: '2024-10-05T11:20:00.000Z',
  },
  {
    id: 6,
    description: 'Supermercado',
    price: 280,
    category: 'Alimentação',
    type: 'outcome',
    createdAt: '2024-10-18T18:30:00.000Z',
  },
  {
    id: 7,
    description: 'Conta de luz',
    price: 120,
    category: 'Casa',
    type: 'outcome',
    createdAt: '2024-10-17T10:15:00.000Z',
  },
  {
    id: 8,
    description: 'Gasolina',
    price: 85,
    category: 'Transporte',
    type: 'outcome',
    createdAt: '2024-10-16T14:00:00.000Z',
  },
  {
    id: 9,
    description: 'Netflix',
    price: 25,
    category: 'Lazer',
    type: 'outcome',
    createdAt: '2024-10-14T20:00:00.000Z',
  },
  {
    id: 10,
    description: 'Farmácia',
    price: 60,
    category: 'Saúde',
    type: 'outcome',
    createdAt: '2024-10-13T09:30:00.000Z',
  },
  {
    id: 11,
    description: 'Almoço restaurante',
    price: 35,
    category: 'Alimentação',
    type: 'outcome',
    createdAt: '2024-10-11T12:30:00.000Z',
  },
  {
    id: 12,
    description: 'Internet',
    price: 90,
    category: 'Casa',
    type: 'outcome',
    createdAt: '2024-10-09T08:00:00.000Z',
  },
  {
    id: 13,
    description: 'Uber',
    price: 18,
    category: 'Transporte',
    type: 'outcome',
    createdAt: '2024-10-07T19:45:00.000Z',
  },
]

const LOCAL_STORAGE_KEY = 'dt-money-transactions'

export const getStoredTransactions = (): Transaction[] => {
  // Proteção para ambientes SSR (Next.js, etc)
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser) return [...DEMO_TRANSACTIONS]

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      // Normaliza datas para garantir formato ISO consistente
      return JSON.parse(stored).map((t: Transaction) => ({
        ...t,
        createdAt: new Date(t.createdAt).toISOString(),
      }))
    }
  } catch (error) {
    console.warn('Erro ao carregar transações do localStorage:', error)
  }

  // Se não tem dados salvos ou houve erro, retorna dados demo
  return [...DEMO_TRANSACTIONS]
}

export const saveTransactions = (transactions: Transaction[]): void => {
  // Proteção para ambientes SSR (Next.js, etc)
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser) return

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.warn('Erro ao salvar transações no localStorage:', error)
  }
}

export const getNextId = (transactions: Transaction[]): number => {
  return transactions.length > 0
    ? Math.max(...transactions.map((t) => t.id)) + 1
    : 1
}

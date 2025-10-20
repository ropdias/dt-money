import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'
import {
  getStoredTransactions,
  saveTransactions,
  getNextId,
} from '../utils/mockData'

export interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  isOfflineMode: boolean
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const fetchTransactions = useCallback(
    async (query?: string) => {
      // Se está em modo offline, usa apenas localStorage
      if (isOfflineMode) {
        let localTransactions = getStoredTransactions()

        if (query) {
          localTransactions = localTransactions.filter(
            (transaction) =>
              transaction.description
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              transaction.category.toLowerCase().includes(query.toLowerCase()),
          )
        }

        localTransactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        setTransactions(localTransactions)
        return
      }

      // Se está em modo online, tenta buscar do servidor
      try {
        const response = await api.get('transactions', {
          params: {
            _sort: 'createdAt',
            _order: 'desc',
            q: query,
          },
        })

        setTransactions(response.data)
        saveTransactions(response.data)
      } catch (error) {
        console.warn('Erro ao buscar transações do servidor:', error)
        // Em modo online, se falhar, apenas loga o erro
        // A definição do modo acontece apenas no useEffect inicial
      }
    },
    [isOfflineMode],
  )

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data

      // Se está em modo offline, cria direto no localStorage
      if (isOfflineMode) {
        const newTransaction: Transaction = {
          id: getNextId(transactions),
          description,
          price,
          category,
          type,
          createdAt: new Date().toISOString(),
        }

        const newTransactions = [newTransaction, ...transactions]
        setTransactions(newTransactions)
        saveTransactions(newTransactions)
        return
      }

      // Se está em modo online, tenta criar no servidor
      try {
        const response = await api.post('transactions', {
          description,
          price,
          category,
          type,
          createdAt: new Date(),
        })

        const newTransactions = [response.data, ...transactions]
        setTransactions(newTransactions)
        saveTransactions(newTransactions)
      } catch (error) {
        console.warn('Erro ao criar transação no servidor:', error)
        // Em modo online, se falhar, apenas loga o erro
      }
    },
    [transactions, isOfflineMode],
  )

  // Checagem inicial única para determinar o modo (online/offline)
  useEffect(() => {
    const checkServerAndFetch = async () => {
      try {
        const response = await api.get('transactions', {
          params: {
            _sort: 'createdAt',
            _order: 'desc',
          },
        })

        // Servidor disponível - modo online
        setTransactions(response.data)
        saveTransactions(response.data)
        console.log('✅ Modo online - conectado ao servidor')
      } catch {
        // Servidor offline - ativa modo offline e busca do localStorage
        setIsOfflineMode(true)
        console.warn('🔌 Modo offline - usando localStorage')
      }
    }

    checkServerAndFetch()
  }, [])

  // Busca transações após definir o modo offline
  useEffect(() => {
    if (isOfflineMode) {
      fetchTransactions()
    }
  }, [isOfflineMode, fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
        isOfflineMode,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

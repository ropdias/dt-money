import {
  HeaderContainer,
  HeaderContent,
  NewTransactionButton,
  OfflineBadge,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import logoImg from '../../assets/logo.svg'
import { NewTransactionModal } from '../NewTransactionModal'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../../contexts/TransactionsContext'

export function Header() {
  const isOfflineMode = useContextSelector(
    TransactionsContext,
    (context) => context.isOfflineMode,
  )

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="" />

        {isOfflineMode && <OfflineBadge>🔌 Modo Offline</OfflineBadge>}

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>
          <NewTransactionModal />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}

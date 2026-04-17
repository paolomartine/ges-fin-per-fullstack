import { AccountView } from './AccountView';

interface Account {
  id: string;
  type: 'efectivo' | 'bancario';
  name?: string;
  currency: 'COP' | 'USD' | 'EUR';
  balance: number;
}

interface AccountsTableProps {
  accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  if (accounts.length === 0) {
    return <p className="empty-state">Aún no tienes cuentas registradas</p>;
  }

  return (
    <div className="accounts-container">
      {accounts.map((account) => (
        <AccountView key={account.id} account={account} />
      ))}
    </div>
  );
}

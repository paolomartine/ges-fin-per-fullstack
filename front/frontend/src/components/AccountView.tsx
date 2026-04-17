interface Account {
  id: string;
  type: 'efectivo' | 'bancario';
  name?: string;
  currency: 'COP' | 'USD' | 'EUR';
  balance: number;
}

interface AccountViewProps {
  account: Account;
}

export function AccountView({ account }: AccountViewProps) {
  const formattedBalance = account.balance.toLocaleString('es-CO', {
    style: 'currency',
    currency: account.currency,
    minimumFractionDigits: 0,
  });

  const accountName = account.type === 'efectivo' ? 'Efectivo' : (account.name || 'Cuenta Bancaria');

  return (
    <div className="account-card">
      <div>
        <p className="account-name">{accountName}</p>
        <p className="account-type">{account.type === 'efectivo' ? 'Efectivo' : 'Bancaria'} - {account.currency}</p>
      </div>
      <p className="account-balance">{formattedBalance}</p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AccountsTable } from '@/components/AccountsTable';
import { AddAccountForm } from '@/components/AddAccountForm';
import { TransactionModal } from '@/components/TransactionModal';

interface Movement {
  id: string;
  accountId: string;
  type: 'gasto' | 'ingreso';
  amount: number;
}

interface Account {
  id: string;
  type: 'efectivo' | 'bancario';
  name?: string;
  currency: 'COP' | 'USD' | 'EUR';
  balance: number;
}

function DashboardHeader({ username, onLogout }: { username: string; onLogout: () => void }) {
  return (
    <header className="dashboard-header">
      <div>
        <div className="dashboard-logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Coin circle */}
            <circle cx="14" cy="14" r="13" fill="#16a34a" opacity="0.12" />
            <circle cx="14" cy="14" r="13" stroke="#16a34a" strokeWidth="1.5" />
            {/* Trending-up arrow */}
            <path
              d="M7 18L12 13L15 16L21 10"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 10H21V14"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="dashboard-logo-text">Finanzas personales</span>
        </div>
        <p className="dashboard-welcome">Bienvenido, {username}</p>
      </div>

      <button className="dashboard-logout-btn" type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </header>
  );
}

function MovementsList({ movements, accounts }: { movements: Movement[]; accounts: Account[] }) {
  if (movements.length === 0) {
    return <p className="dashboard-empty-state">Aún no tienes movimientos</p>;
  }

  return (
    <ul className="dashboard-movements-list">
      {movements.map((movement) => {
        const account = accounts.find(acc => acc.id === movement.accountId);
        const formattedAmount = movement.amount.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
        });

        return (
          <li key={movement.id} className="dashboard-movement-item">
            <div>
              <span className="dashboard-movement-description">
                {account?.name || 'Movimiento'}
              </span>
              <span className="dashboard-movement-type">
                {movement.type === 'gasto' ? 'Gasto' : 'Ingreso'}
              </span>
            </div>
            <span className={`dashboard-movement-amount ${movement.type === 'ingreso' ? 'dashboard-movement-positive' : 'dashboard-movement-negative'}`}>
              {movement.type === 'ingreso' ? '+' : '-'}{formattedAmount}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddAccount = (newAccount: Account) => {
    if (newAccount.type === 'efectivo' && accounts.some(acc => acc.type === 'efectivo')) {
      alert('Ya existe una cuenta de efectivo');
      return;
    }
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleAddTransaction = (transaction: Omit<Movement, 'id'>) => {
    const targetAccount = accounts.find((account) => account.id === transaction.accountId);
    if (!targetAccount) {
      alert('No se encontró la cuenta seleccionada.');
      return;
    }

    const updatedBalance = transaction.type === 'gasto'
      ? targetAccount.balance - transaction.amount
      : targetAccount.balance + transaction.amount;

    if (transaction.type === 'gasto' && updatedBalance < 0) {
      alert('Saldo insuficiente para este gasto');
      return;
    }

    const newMovement: Movement = {
      id: Date.now().toString(),
      ...transaction,
    };

    setMovements((prev) => [...prev, newMovement]);
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === transaction.accountId
          ? { ...account, balance: updatedBalance }
          : account
      )
    );
  };

  const username = session?.user?.username ?? 'Usuario';

  const hasCashAccount = accounts.some(acc => acc.type === 'efectivo');

  return (
    <main className="dashboard-page">
      <div className="dashboard-card">
        <DashboardHeader username={username} onLogout={handleLogout} />

        <section className="dashboard-section dashboard-actions-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Mis Cuentas</h2>
            <div className="dashboard-actions-group">
              <button type="button" className="dashboard-action-button" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancelar' : 'Agregar cuenta'}
              </button>
              <button type="button" className="dashboard-action-button">
                Cambiar cuenta
              </button>
            </div>
          </div>
        </section>

        {showAddForm && (
          <AddAccountForm
            onAddAccount={handleAddAccount}
            onCancel={() => setShowAddForm(false)}
            hasCashAccount={hasCashAccount}
          />
        )}

        <AccountsTable accounts={accounts} />

        <section className="dashboard-section dashboard-movements-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Últimos movimientos</h2>
          </div>

          <MovementsList movements={movements} accounts={accounts} />
        </section>

        {accounts.length > 0 && (
          <div className="dashboard-footer">
            <button type="button" className="dashboard-new-movement-button" onClick={() => setShowTransactionModal(true)}>
              Nuevo Movimiento
            </button>
          </div>
        )}

        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleAddTransaction}
          accounts={accounts}
          username={username}
        />
      </div>
    </main>
  );
}

import { useState } from 'react';

interface Account {
  id: string;
  type: 'efectivo' | 'bancario';
  name?: string;
  currency: 'COP' | 'USD' | 'EUR';
  balance: number;
}

interface TransactionPayload {
  accountId: string;
  type: 'gasto' | 'ingreso';
  amount: number;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionPayload) => void;
  accounts: Account[];
  username?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  accounts,
  username = 'Usuario',
}: TransactionModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [type, setType] = useState<'gasto' | 'ingreso'>('gasto');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ accountId?: string; amount?: string }>({});

  const validate = () => {
    const newErrors: { accountId?: string; amount?: string } = {};

    if (!selectedAccountId) {
      newErrors.accountId = 'Debe seleccionar una cuenta';
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'El monto debe ser un número mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const transaction: TransactionPayload = {
      accountId: selectedAccountId,
      type,
      amount: parseFloat(amount),
    };

    onSubmit(transaction);

    // Limpiar formulario
    setSelectedAccountId('');
    setType('gasto');
    setAmount('');
    setErrors({});

    // Cerrar modal
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = selectedAccountId && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  return (
    <div className="transaction-modal-overlay" onClick={onClose}>
      <div className="transaction-modal" onClick={(e) => e.stopPropagation()}>
        <div className="transaction-modal-header">
          <h2 className="transaction-modal-title">Nuevo movimiento</h2>
          <button
            type="button"
            className="transaction-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input id="username" type="text" value={username} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="account-select">Cuenta *</label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className={errors.accountId ? 'select-error' : ''}
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.type === 'efectivo' ? 'Efectivo' : (account.name || 'Cuenta Bancaria')}
                </option>
              ))}
            </select>
            {errors.accountId && <p className="error-message">{errors.accountId}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="transaction-type">Tipo de movimiento *</label>
            <select
              id="transaction-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'gasto' | 'ingreso')}
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Monto *</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <p className="error-message">{errors.amount}</p>}
          </div>

          <div className="transaction-modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={!isFormValid}>
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


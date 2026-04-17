import { useState } from 'react';

interface Account {
  id: string;
  type: 'efectivo' | 'bancario';
  name?: string;
  currency: 'COP' | 'USD' | 'EUR';
  balance: number;
}

interface AddAccountFormProps {
  onAddAccount: (account: Account) => void;
  onCancel?: () => void;
  hasCashAccount: boolean;
}

export function AddAccountForm({ onAddAccount, onCancel, hasCashAccount }: AddAccountFormProps) {
  const [type, setType] = useState<'efectivo' | 'bancario'>('bancario');
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [errors, setErrors] = useState<{ type?: string; currency?: string; name?: string; balance?: string }>({});

  const validate = () => {
    const newErrors: { type?: string; currency?: string; name?: string; balance?: string } = {};

    if (!type) {
      newErrors.type = 'Debes seleccionar un tipo de cuenta';
    } else if (type === 'efectivo' && hasCashAccount) {
      newErrors.type = 'Ya existe una cuenta de efectivo';
    }

    if (!currency) {
      newErrors.currency = 'Debes seleccionar una moneda (COP, USD o EUR)';
    }

    if (type === 'bancario' && !name.trim()) {
      newErrors.name = 'El nombre es obligatorio para cuentas bancarias';
    }

    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum) || balance.trim() === '') {
      newErrors.balance = 'El saldo es obligatorio';
    } else if (balanceNum < 0) {
      newErrors.balance = 'El saldo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const newAccount: Account = {
      id: Date.now().toString(),
      type,
      currency,
      balance: parseFloat(balance),
      ...(type === 'bancario' && { name: name.trim() }),
    };

    onAddAccount(newAccount);

    // Limpiar formulario
    setType('bancario');
    setCurrency('COP');
    setName('');
    setBalance('');
    setErrors({});

    // Ocultar formulario si hay onCancel
    if (onCancel) onCancel();
  };

  const isFormValid = (() => {
    if (!type || !currency) return false;
    if (type === 'efectivo' && hasCashAccount) return false;
    if (type === 'bancario' && !name.trim()) return false;
    const balanceNum = parseFloat(balance);
    return !isNaN(balanceNum) && balanceNum >= 0;
  })();

  return (
    <form onSubmit={handleSubmit} className="add-account-form">
      <div className="form-group">
        <label htmlFor="account-type">Tipo de cuenta</label>
        <select
          id="account-type"
          value={type}
          onChange={(e) => setType(e.target.value as 'efectivo' | 'bancario')}
        >
          <option value="bancario">Bancaria</option>
          <option value="efectivo">Efectivo</option>
        </select>
        {errors.type && <p className="error-message">{errors.type}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="account-currency">Moneda</label>
        <select
          id="account-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as 'COP' | 'USD' | 'EUR')}
        >
          <option value="COP">COP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {errors.currency && <p className="error-message">{errors.currency}</p>}
      </div>

      {type === 'bancario' && (
        <div className="form-group">
          <label htmlFor="account-name">Nombre de la cuenta</label>
          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cuenta de Ahorros"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="account-balance">Saldo inicial</label>
        <input
          id="account-balance"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0.00"
        />
        {errors.balance && <p className="error-message">{errors.balance}</p>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={!isFormValid} className="submit-button">
          Agregar Cuenta
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

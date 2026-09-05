import {
  AddRounded,
  ArrowOutwardRounded,
  CallReceivedRounded,
} from '@mui/icons-material';

/**
 * Formatea un importe numérico como moneda argentina (ARS).
 *
 * Ejemplo: 250000.5 → "$ 250.000,50"
 *
 * @param {number} amount Importe a formatear.
 * @returns {string} Cadena con formato monetario.
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount ?? 0);

/**
 * Devuelve la presentación visual correspondiente al tipo de movimiento.
 *
 * La dirección del monto (signo) y la paleta de colores se determinan
 * a partir del valor de `transaction.type` que envía el backend.
 *
 * @param {{ type: string }} transaction Objeto con al menos la propiedad `type`.
 * @returns {{ label: string, sign: string, Icon: React.ElementType, iconColor: string, iconBackground: string, amountColor: string }}
 */
export const getTransactionPresentation = (transaction) => {
  switch (transaction?.type) {
    case 'Deposit':
      return {
        label: 'Depósito',
        sign: '+',
        Icon: AddRounded,
        iconColor: '#7C3AED',
        iconBackground: '#F3E8FF',
        borderColor: '#D8B4FE',
        amountColor: '#15803D',
      };

    case 'TransferIn':
      return {
        label: 'Transferencia recibida',
        sign: '+',
        Icon: CallReceivedRounded,
        iconColor: '#15803D',
        iconBackground: '#DCFCE7',
        borderColor: '#86EFAC',
        amountColor: '#15803D',
      };

    case 'TransferOut':
      return {
        label: 'Transferencia enviada',
        sign: '-',
        Icon: ArrowOutwardRounded,
        iconColor: '#0284C7',
        iconBackground: '#E0F2FE',
        borderColor: '#7DD3FC',
        amountColor: '#1E3A5F',
      };

    default:
      return {
        label: 'Movimiento',
        sign: '',
        Icon: ArrowOutwardRounded,
        iconColor: '#475569',
        iconBackground: '#F1F5F9',
        borderColor: '#CBD5E1',
        amountColor: '#1E3A5F',
      };
  }
};

/**
 * Genera el título principal de un movimiento (ej. "Transferencia a Lucio", "Depósito", etc.).
 *
 * @param {Object} transaction
 * @returns {string} Título principal del movimiento.
 */
export const getTransactionTitle = (transaction) => {
  if (!transaction) return 'Movimiento';

  if (transaction.type === 'TransferOut') {
    if (transaction.destinationUserFullName && transaction.destinationUserFullName.trim()) {
      return `Transferencia enviada a ${transaction.destinationUserFullName.trim()}`;
    }
    if (transaction.destinationAccountEmail && transaction.destinationAccountEmail.trim()) {
      return `Transferencia enviada a ${transaction.destinationAccountEmail.trim()}`;
    }
    return 'Transferencia enviada';
  }

  if (transaction.type === 'TransferIn') {
    if (transaction.destinationUserFullName && transaction.destinationUserFullName.trim()) {
      return `Transferencia recibida de ${transaction.destinationUserFullName.trim()}`;
    }
    if (transaction.originAccountEmail && transaction.originAccountEmail.trim()) {
      return `Transferencia recibida de ${transaction.originAccountEmail.trim()}`;
    }
    return 'Transferencia recibida';
  }

  if (transaction.type === 'Deposit') {
    return 'Depósito';
  }

  return 'Movimiento';
};

/**
 * Genera la línea de subtexto secundario combinando concepto y fecha (ej. "Varios • 01 Sept, 10:04").
 *
 * @param {Object} transaction
 * @returns {string} Subtexto del movimiento.
 */
export const getTransactionSubtext = (transaction) => {
  if (!transaction) return '';
  const conceptText =
    transaction.concept && transaction.concept.trim()
      ? transaction.concept.trim()
      : 'Varios';
  const dateText = formatTransactionDate(transaction.createdDate);
  return `${conceptText} • ${dateText}`;
};

/**
 * Formatea la fecha de un movimiento de forma legible.
 *
 * Si la fecha corresponde al día actual devuelve "Hoy, HH:mm".
 * En caso contrario devuelve "dd mes." (ej. "01 sep.").
 *
 * @param {string|Date} date Fecha a formatear.
 * @returns {string} Fecha formateada para la UI.
 */
export const formatTransactionDate = (date) => {
  const transactionDate = new Date(date);
  const today = new Date();

  const isToday =
    transactionDate.getDate() === today.getDate() &&
    transactionDate.getMonth() === today.getMonth() &&
    transactionDate.getFullYear() === today.getFullYear();

  const time = transactionDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `Hoy, ${time}`;
  }

  return transactionDate.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });
};

/**
 * Formatea la fecha de un movimiento con formato largo.
 *
 * Ideal para tablas donde se necesita más detalle:
 * "01 sep. 2026, 14:30"
 *
 * @param {string|Date} date Fecha a formatear.
 * @returns {string} Fecha formateada con día, mes, año y hora.
 */
export const formatTransactionDateLong = (date) => {
  const d = new Date(date);
  const today = new Date();

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const time = d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `Hoy, ${time}`;
  }

  const dateStr = d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `${dateStr}, ${time}`;
};

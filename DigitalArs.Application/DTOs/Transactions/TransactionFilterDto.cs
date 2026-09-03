using DigitalArs.Domain.Entities;

namespace DigitalArs.Application.DTOs.Transactions;


/// Parámetros de consulta y filtrado para el historial de transacciones (HU-17).

public class TransactionFilterDto
{
   
    /// Filtro por tipo de transacción (Deposit, TransferIn, TransferOut)
    public TransactionType? Type { get; set; }

    
    /// Fecha inicial del rango (inclusiva)
    public DateTime? FromDate { get; set; }

   
    /// Fecha final del rango (inclusiva)
     public DateTime? ToDate { get; set; }

    
    /// Monto mínimo
     public decimal? MinAmount { get; set; }

     /// Monto máximo
     public decimal? MaxAmount { get; set; }

     /// Número de página actual (por defecto 1)
     public int Page { get; set; } = 1;

     /// Cantidad de elementos por página (por defecto 10)
     public int PageSize { get; set; } = 10;
}


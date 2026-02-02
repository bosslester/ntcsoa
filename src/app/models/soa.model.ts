export interface AccessSOA {
  id?: number;                 // ID
  dateIssued?: string | null;  // "Date issued"
  licensee?: string | null;    // LICENSEE
  address?: string | null;     // Address
  particulars?: string | null; // Particulars
  periodCovered?: string | null; // "Period covered"

  rslRadioStation?: number | null; // money
  rocOperatorFee?: number | null;  // money
  rslSurcharge?: number | null;    // money
  dst?: number | null;             // money

  remarksNote?: string | null;     // "REMARKS/NOTE"
}




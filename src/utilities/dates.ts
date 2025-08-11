export interface DateParts {
  full: string;
  month: string;
  abbrMonth: string; 
  day: number;
  year: number;
  raw: Date;
}

export function parseDateParts(dateInput: string | number | Date): DateParts {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return {
      full: '',
      month: '',
      abbrMonth: '',
      day: NaN,
      year: NaN, 
      raw: date,
    };
  }

  return {
    full: date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    month: date.toLocaleString('en-US', { month: 'long' }),
    abbrMonth: date.toLocaleString('en-US', { month: 'short' }),
    day: date.getDate(),
    year: date.getFullYear(), 
    raw: date,
  };
}

export function tryParseDateParts(input?: string | number | Date) {
  if (!input) return null; 
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return parseDateParts(d);
}

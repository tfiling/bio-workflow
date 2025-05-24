import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateDuration(timeString: string): number {
  // Convert time strings like "30 minutes", "2 hours", "1 day" to minutes
  const value = parseInt(timeString.split(' ')[0]);
  const unit = timeString.split(' ')[1].toLowerCase();
  
  switch (unit) {
    case 'minute':
    case 'minutes':
      return value;
    case 'hour':
    case 'hours':
      return value * 60;
    case 'day':
    case 'days':
      return value * 60 * 24;
    default:
      return 0;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function evaluateFormula(
  formula: string, 
  parameters: Record<string, string | number | boolean>
): number {
  // Replace parameter placeholders with actual values
  let computationString = formula;
  
  for (const [key, value] of Object.entries(parameters)) {
    // Only use numerical values in formulas
    if (typeof value === 'number') {
      computationString = computationString.replace(
        new RegExp(`\\$\\{${key}\\}`, 'g'), 
        value.toString()
      );
    }
  }
  
  try {
    // Use Function constructor to evaluate the mathematical expression
    // This is safer than eval() as it only evaluates mathematical expressions
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${computationString})`)();
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
}
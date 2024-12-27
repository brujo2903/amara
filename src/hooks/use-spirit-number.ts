import { useState, useEffect } from 'react';

function generateSpiritNumber(): number {
  return Math.floor(Math.random() * 9000) + 1000; // Generate number between 1000-9999
}

export function useSpiritNumber() {
  const [spiritNumber, setSpiritNumber] = useState<number | null>(null);

  useEffect(() => {
    // Try to get existing spirit number from localStorage
    const stored = localStorage.getItem('morvak_spirit_number');
    
    if (stored) {
      setSpiritNumber(parseInt(stored));
    } else {
      // Generate new spirit number if none exists
      const newNumber = generateSpiritNumber();
      localStorage.setItem('morvak_spirit_number', newNumber.toString());
      setSpiritNumber(newNumber);
    }
  }, []);

  return spiritNumber;
}
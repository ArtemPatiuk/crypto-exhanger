import { useEffect, useState } from 'react';
import { IbinanceBookTicker } from '../types/interface';


const getCorrectSymbol = (from: string, to: string): string => {
  return `${from}${to}`.toUpperCase();
};
const fetchRestData = async (symbol: string) => {
  const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for symbol: ${symbol}`);
  }
  const data = await response.json();
  return data.price;
};

const useBinance = (assetFromName: string, assetToName: string) => {
  const [coursesInfo, setCoursesInfo] = useState<IbinanceBookTicker | null>(null);
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    if ((!assetFromName || !assetToName) || (assetFromName === assetToName)) {
      setCoursesInfo(null)
      return;
    }

    const fetchExchangeRate = async (symbol: string, isReversed: boolean = false) => {
      try {
        const restData = await fetchRestData(symbol);
        setCoursesInfo({
          symbol,
          price: restData,
        });
        setReversed(false);
        if (isReversed) {
          setReversed(true);
        }
      } catch (error) {
        if (!isReversed) {
          const reversedSymbol = getCorrectSymbol(assetToName, assetFromName);
          fetchExchangeRate(reversedSymbol, true);
        } else {
          console.log(`Не вдалось отримати обмінний курс`);
        }
      }
    };

    const symbol = getCorrectSymbol(assetFromName, assetToName);
    fetchExchangeRate(symbol);

  }, [assetFromName, assetToName]);

  return { coursesInfo, reversed, resetFetch: () => setCoursesInfo(null) };
};

export default useBinance;
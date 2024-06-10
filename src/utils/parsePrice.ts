const parsePrice = (price: string): number | null => {
  if(price === '-' || price === '') return null;

  let cleanedPrice = price.replace(/[^\d,]/g, '');
  cleanedPrice = cleanedPrice.replace(/,/g, '');
  const numberPrice = Number(cleanedPrice);

  if (isNaN(numberPrice)) {
    throw new Error(`Invalid price format: ${price}`);
  }

  return numberPrice;
}

export default parsePrice;

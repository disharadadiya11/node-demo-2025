const calculateDiscount = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

const isInStock = (stock) => {
  return stock > 0;
};

module.exports = {
  calculateDiscount,
  formatPrice,
  isInStock,
};


export const productDiscount = (product:any) => {
    console.log('utils discount giver function ',product)
    const currentDate = new Date();

    const timeUntilExpiry = product.expiry_date.getTime() - currentDate.getTime();
    const daysUntilExpiry = timeUntilExpiry / (1000 * 3600 * 24); // Convert to days

    // Define discount tiers based on days remaining
    if (daysUntilExpiry <= 5) {
      const discount = 0.1; // 10% off for products expiring within a week
      return discount;
    } else if (daysUntilExpiry <= 10) {
      const discount = 0.05; // 5% off for products expiring within two weeks
        return discount;
    } else {
      const discount = 0; // No discount for products with more than two weeks until expiry
      return discount;
    }
}
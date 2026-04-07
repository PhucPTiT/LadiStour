const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
    return numberFormatter.format(price);
}

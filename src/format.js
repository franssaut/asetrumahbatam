export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

export const propertySlug = (property) => {
  const slugParts = [property.title, property.location, property.id];

  return slugParts
    .map((part) => String(part)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""))
    .filter(Boolean)
    .join("-");
};

export const propertyPath = (property) => `/properti/${propertySlug(property)}`;

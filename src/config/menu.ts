export type MenuCategory = "Kopi" | "Non-kopi" | "Camilan";

export type MenuItem = {
  name: string;
  category: MenuCategory;
  // TODO: Ganti dengan harga asli kedai.
  price: number;
  tags?: Array<"favorit" | "es" | "baru">;
};

export const menuItems: MenuItem[] = [
  // TODO: Lengkapi daftar menu asli dan harga.
  { name: "Kopi Susu Lima", category: "Kopi", price: 0, tags: ["favorit", "es"] },
  { name: "Americano", category: "Kopi", price: 0, tags: ["es"] },
  { name: "Chocolate", category: "Non-kopi", price: 0, tags: ["es"] },
];

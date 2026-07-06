export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  logo_url: string | null;
  description: string | null;
  category_id: string;
  sub_category_id: string | null;
  created_at: string;
  // Join properties
  categories?: { name: string };
  sub_categories?: { name: string };
}

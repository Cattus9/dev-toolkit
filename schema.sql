-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sub_categories table
CREATE TABLE sub_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(category_id, name)
);

-- Create tools table
CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
    sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create policies (for personal use, we can allow all access, or restrict if auth is enabled. Let's make them publicly readable and writeable for convenience or authenticated user access)
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access to sub_categories" ON sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to sub_categories" ON sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to sub_categories" ON sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to sub_categories" ON sub_categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access to tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to tools" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to tools" ON tools FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to tools" ON tools FOR DELETE USING (true);

-- Insert some default categories and subcategories
INSERT INTO categories (name) VALUES 
('Development'),
('Design'),
('AI Tools'),
('Marketing'),
('Productivity')
ON CONFLICT (name) DO NOTHING;

-- Get the categories IDs and insert default subcategories
-- (These will execute if categories exist)
INSERT INTO sub_categories (category_id, name)
SELECT id, 'Frontend' FROM categories WHERE name = 'Development'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name)
SELECT id, 'Backend' FROM categories WHERE name = 'Development'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name)
SELECT id, 'UI/UX' FROM categories WHERE name = 'Design'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name)
SELECT id, 'Assets & Icons' FROM categories WHERE name = 'Design'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name)
SELECT id, 'Text Generation' FROM categories WHERE name = 'AI Tools'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name)
SELECT id, 'Image Generation' FROM categories WHERE name = 'AI Tools'
ON CONFLICT DO NOTHING;

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("tools")
      .select(`
        *,
        categories(name),
        sub_categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, url, description, category_id, sub_category_id } = await request.json();
    if (!name || !url || !category_id) {
      return NextResponse.json(
        { error: "Name, URL, and category_id are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Call our fetch-metadata endpoint internally or call fetch directly to get og:image and logo
    let image_url = null;
    let logo_url = null;
    try {
      const baseUrl = request.url ? new URL(request.url).origin : "http://localhost:3000";
      const metadataRes = await fetch(
        `${baseUrl}/api/fetch-metadata?url=${encodeURIComponent(url)}`,
        { method: "GET" }
      );
      if (metadataRes.ok) {
        const metadata = await metadataRes.json();
        image_url = metadata.image || null;
        logo_url = metadata.logo || null;
      }
    } catch (metadataErr) {
      console.error("Failed to automatically fetch metadata:", metadataErr);
    }

    const { data, error } = await supabase
      .from("tools")
      .insert({
        name,
        url,
        description,
        category_id,
        sub_category_id,
        image_url,
        logo_url,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const { id, name, url, description, category_id, sub_category_id, logo_url, image_url } = await request.json();
    if (!id || !name || !url || !category_id) {
      return NextResponse.json({ error: "id, name, url, and category_id are required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("tools")
      .update({
        name,
        url,
        description,
        category_id,
        sub_category_id: sub_category_id || null,
        logo_url,
        image_url
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from("tools").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

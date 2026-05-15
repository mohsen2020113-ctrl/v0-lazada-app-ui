import { NextResponse } from "next/server"
export async function GET() {
  const mockStreams = [
    { id: "s1", title: "بث مباشر - معرض كانتون الدولي", vendor: "Canton Fair Official", viewers: 3420, thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", is_live: true, products_count: 89 },
    { id: "s2", title: "مصنع الإلكترونيات - شنغهاي مباشر", vendor: "Shanghai Electronics", viewers: 1890, thumbnail: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", is_live: true, products_count: 34 },
    { id: "s3", title: "سوق يوو - مباشر من المصنع", vendor: "Yiwu Market", viewers: 2100, thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", is_live: true, products_count: 56 }
  ]
  return NextResponse.json(mockStreams)
}

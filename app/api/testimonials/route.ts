import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import TestimonialModel from '@/lib/models/TestimonialModel';

type TItem = {
  id: string;
  name: string;
  role?: string;
  rating?: number;
  quote: string;
  city?: string;
};

export async function GET(_req: NextRequest) {
  try {
    await dbConnect();
    const docs = await TestimonialModel.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(24)
      .lean();
    const items: TItem[] = (Array.isArray(docs) ? docs : []).map((d: any) => ({
      id: String(d._id),
      name: d.name,
      role: [d.role, d.city].filter(Boolean).join(' · ') || undefined,
      rating: d.rating,
      quote: d.quote,
      city: d.city,
    }));
    return Response.json({ items });
  } catch (e) {
    return Response.json({ items: [] });
  }
}


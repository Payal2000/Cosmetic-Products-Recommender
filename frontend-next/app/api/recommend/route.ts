import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { query, filters } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!process.env.PINECONE_API_KEY || !process.env.INDEX_NAME || !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing API keys in server configuration' }, { status: 500 });
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.index(process.env.INDEX_NAME);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    const pineconeFilter: any = {};
    if (filters && filters.length > 0) {
      pineconeFilter['category'] = { '$in': filters };
    }

    const results = await index.query({
      vector: queryVector,
      topK: 50,
      includeMetadata: true,
      filter: Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined,
    });

    const matches = results.matches.map((match: any) => ({
      id: match.id,
      score: match.score,
      product_name: match.metadata.product_name,
      price: match.metadata.price || 0,
      category: match.metadata.category,
      rating: match.metadata.rating || 0,
      review_count: match.metadata.review_count || 0,
      description: match.metadata.description,
      variant_title_product: match.metadata.variant_title,
      image_url: match.metadata.variant_image,
      product_url: match.metadata.product_url,
      available: match.metadata.available,
    }));

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error('Error in recommend API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

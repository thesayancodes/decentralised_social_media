import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { action, payload } = data;

    switch (action) {
      case 'sync_profile':
        await prisma.profile.upsert({
          where: { address: payload.address },
          update: {
            username: payload.username,
            avatarUrl: payload.avatarUrl,
            bio: payload.bio,
          },
          create: {
            address: payload.address,
            username: payload.username,
            avatarUrl: payload.avatarUrl,
            bio: payload.bio,
          },
        });
        break;

      case 'sync_post': {
        const updateData: Record<string, unknown> = {};
        if (payload.likeCount !== undefined) updateData.likeCount = payload.likeCount;
        if (payload.commentCount !== undefined) updateData.commentCount = payload.commentCount;
        if (payload.content !== undefined) updateData.content = payload.content;

        await prisma.post.upsert({
          where: { id: payload.id },
          update: updateData,
          create: {
            id: payload.id,
            author: payload.author,
            content: payload.content,
            topic: payload.topic || "general",
            timestamp: payload.timestamp,
            likeCount: payload.likeCount || 0,
            commentCount: payload.commentCount || 0,
            ipfsHash: payload.ipfsHash || null,
          },
        });
        
        // Reward mechanism: update streak and balance
        try {
          await prisma.profile.updateMany({
            where: { address: payload.author },
            data: { balance: { increment: 10 } },
          });
        } catch (e) {
          // Ignore if profile doesn't exist yet
        }
        break;
      }

      case 'sync_like':
        await prisma.like.upsert({
          where: { postId_liker: { postId: payload.postId, liker: payload.liker } },
          update: {},
          create: { postId: payload.postId, liker: payload.liker },
        });
        await prisma.post.update({
          where: { id: payload.postId },
          data: { likeCount: { increment: 1 } },
        });
        break;

      case 'sync_unlike':
        try {
          await prisma.like.delete({
            where: { postId_liker: { postId: payload.postId, liker: payload.liker } },
          });
          await prisma.post.update({
            where: { id: payload.postId },
            data: { likeCount: { decrement: 1 } },
          });
        } catch (e) {
          // ignore if already deleted
        }
        break;

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    if (type === 'feed') {
      const posts = await prisma.post.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50,
      });
      return NextResponse.json(posts);
    }

    if (type === 'profile') {
      const address = searchParams.get('address');
      if (!address) return NextResponse.json({ error: 'Missing address' }, { status: 400 });
      
      const profile = await prisma.profile.findUnique({
        where: { address },
      });
      return NextResponse.json(profile || { balance: 0, streak: 0 });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

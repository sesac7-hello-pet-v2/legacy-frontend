'use server';

import {revalidatePath, revalidateTag} from 'next/cache';

interface RevalidationOptions {
    userId?: number;
    skipIfRecentlyRevalidated?: boolean;
    forceRevalidate?: boolean;
}

// 최근 무효화 시간 추적 (메모리 기반, 실제론 Redis 등 사용 권장)
const lastRevalidationMap = new Map<string, number>();

async function revalidateFeed(options: RevalidationOptions = {}) {
    try {
        const {
            userId,
            skipIfRecentlyRevalidated = true,
            forceRevalidate = false
        } = options;

        const cacheKey = userId ? `feed-user-${userId}` : 'feed-global';
        const now = Date.now();
        const lastRevalidation = lastRevalidationMap.get(cacheKey) || 0;

        // 최근 5초 내에 무효화했다면 스킵 (서버 부하 방지)
        if (skipIfRecentlyRevalidated && !forceRevalidate && (now - lastRevalidation) < 5000) {
            console.log(`⏭️ 최근 무효화됨 (${now - lastRevalidation}ms 전), 스킵`);
            return {
                success: true,
                skipped: true,
                lastRevalidation,
                message: 'Recently revalidated, skipped to reduce server load'
            };
        }

        // 피드 캐시 무효화
        revalidatePath('/feed');
        revalidatePath('/');

        // 태그 기반 캐시 무효화 (더 정확한 무효화)
        revalidateTag('feed-posts');

        // 사용자별 피드 캐시도 무효화 (있다면)
        if (userId) {
            revalidatePath(`/feed/${userId}`);
            revalidateTag(`user-posts-${userId}`);
        }

        // 무효화 시간 기록
        lastRevalidationMap.set(cacheKey, now);

        console.log(`🔄 캐시 무효화 완료: ${cacheKey} at ${now}`);

        return {
            success: true,
            timestamp: now,
            cacheKey,
            message: 'Cache successfully revalidated'
        };
    } catch (error) {
        console.error('Revalidation failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: Date.now()
        };
    }
}

export default revalidateFeed

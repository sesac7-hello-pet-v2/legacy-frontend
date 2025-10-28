// Server-side feed API functions
interface GetPostsParams {
    page?: number;
    size?: number;
    userId?: number;
}

interface PostsResponse {
    content: any[];
    page: {
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
    };
}

export async function getPostsSSR(params: GetPostsParams = {}): Promise<PostsResponse> {
    const {page = 1, size = 10, userId} = params;

    try {
        // API 서버 URL 구성
        let baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://hello-pet.my/api';

        // baseUrl이 상대 경로인 경우 절대 URL로 변환
        if (baseUrl.startsWith('/')) {
            baseUrl = 'https://hello-pet.my' + baseUrl;
        }

        const searchParams = new URLSearchParams({
            page: page.toString(), // API는 1-based 페이징 사용
            size: size.toString(),
        });

        if (userId) {
            searchParams.append('userId', userId.toString());
        }

        const url = `${baseUrl}/posts?${searchParams}`;

        const response = await fetch(url, {
            // SSR에서는 캐시 설정 중요
            next: {
                revalidate: 30, // 30초마다 재검증 (더 빠른 자동 갱신)
                tags: ['feed-posts'] // 태그 기반 무효화 지원
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // 401 errors are expected in SSR when user is not authenticated
            if (response.status === 401) {
                console.log('SSR: User not authenticated, returning empty posts');
                // Return empty data for graceful fallback to client-side rendering
                return {
                    content: [],
                    page: {
                        totalPages: 0,
                        totalElements: 0,
                        size,
                        number: 0,
                    }
                };
            } else {
                console.error(`SSR: Failed to fetch posts: ${response.status}`);
                throw new Error(`Failed to fetch posts: ${response.status}`);
            }
        }

        const data = await response.json();

        // 클라이언트 API와 동일한 형태로 변환
        return {
            content: data.content || [],
            page: {
                totalPages: data.page?.totalPages || 0,
                totalElements: data.page?.totalElements || 0,
                size: data.page?.size || size,
                number: data.page?.number || 0,
            }
        };
    } catch (error) {
        console.error('Error fetching posts on server:', error);
        // 에러 시 빈 결과 반환
        return {
            content: [],
            page: {
                totalPages: 0,
                totalElements: 0,
                size,
                number: 0,
            }
        };
    }
}

import {revalidatePath} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {path, secret} = await request.json();

        // 보안을 위한 secret 검증
        if (secret !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json({error: 'Invalid secret'}, {status: 401});
        }

        // 피드 페이지 캐시 무효화
        revalidatePath('/feed');
        revalidatePath('/');

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            path: path || '/feed'
        });
    } catch (error) {
        return NextResponse.json({error: 'Error revalidating'}, {status: 500});
    }
}

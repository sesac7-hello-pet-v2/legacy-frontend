interface PostContentProps {
    content: string;
}

export default function PostContent({content}: PostContentProps) {
    return (
        <div className="px-4 pb-2">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
}

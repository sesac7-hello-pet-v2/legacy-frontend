import Image from "next/image";
import Link from "next/link";

export default function BoardBanner() {
  return (
    <div
      className="mx-auto mt-22 max-w-7xl rounded-[32px] bg-yellow-100 p-8 shadow-lg flex items-center justify-between"
      style={{ height: "600px" }}
    >
      {/* 왼쪽: 배너 이미지 */}
      <div className="w-1/2 flex justify-center">
        <Image
          src="/bannerImg.png" // public/img/bannerImg.png 위치해야 함!
          alt="입양 배너 이미지"
          width={450}
          height={450}
          className="object-contain"
        />
      </div>

      {/* 오른쪽: 텍스트 + 버튼 */}
      <div className="w-2/3 text-center pr-6 space-y-4">
        <h2 className="text-4xl font-semibold text-amber-400">
          유기동물들의 가족이 되어주세요
        </h2>
        <p className="text-2xl text-amber-400">평생 가족 찾으러 가기</p>

        <Link
          href={`/announcements`}
          className="rounded-full bg-amber-400 hover:bg-amber-500 px-6 py-2 text-white font-semibold transition"
        >
          입양게시판
        </Link>
      </div>
    </div>
  );
}

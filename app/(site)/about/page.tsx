import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "소개 | Hello Pet",
    description: "반려동물과 반려인을 이어주는 따뜻한 연결고리",
};

export default function AboutPage() {
    const stats = [
        {
            number: "11만 3천",
            unit: "마리",
            description: "2023년 전국에서 구조된 유실·유기동물 수",
        },
        {
            number: "39",
            unit: "%",
            description: "주인에게 반환되거나 새 가족에게 입양된 비율",
        },
        {
            number: "300",
            unit: "억원",
            description: "2023년 유기동물 관리 예산 (역대 최고치)",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 히어로 섹션 */}
            <section>
                {/* 카드 1: 반려의 시작 - 배너 이미지 */}
                <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                    <div className="absolute inset-0 opacity-30">
                        <Image
                            src="/bannerImg.png"
                            alt="Hello PET"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="max-w-5xl mx-auto px-8 text-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                                Hello! P.E.T,<br/>
                                반려의 시작 🐾
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                                반려동물과 반려인을 이어주는 따뜻한 연결고리를 만들고 싶어 시작한 프로젝트예요.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 카드 2: 문제 인식 - 깔끔한 배경 */}
                <div className="bg-gray-50 py-20">
                    <div className="max-w-5xl mx-auto px-8">
                        <div className="text-center space-y-6">
                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                                매년 10만 마리가 넘는 동물들이 보호소에 들어오지만,<br/>
                                충분한 입양이 이루어지지 않아 많은 아이들이 안락사되는 현실이 이어지고 있어요.
                            </p>
                            <p className="text-2xl md:text-4xl font-bold text-gray-900 pt-4">
                                Hello PET은 이 안타까운 현실을<br/>
                                조금이라도 바꾸고 싶다는 마음에서 시작됐어요.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 카드 3: 우리의 목표 - 깔끔한 배경 */}
                <div className="bg-white py-20">
                    <div className="max-w-5xl mx-auto px-8">
                        <div className="text-center space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">우리의 목표는 단순해요.</h2>
                            <div className="text-xl md:text-2xl text-gray-700 leading-relaxed space-y-4 max-w-4xl mx-auto">
                                <p>예비 반려인분들이 보호 중인 동물의 정보를 쉽게 확인하고,<br/>
                                입양 절차를 간편하게 안내받아 신청할 수 있도록 해서</p>
                                <p className="font-bold text-gray-900 text-2xl md:text-3xl">
                                    더 많은 동물들이 따뜻한 가족을 만날 수 있게 돕는 거예요.
                                </p>
                                <p className="text-lg md:text-xl text-gray-600 pt-6">
                                    저희를 통해 소중한 인연이 만들어진다면 정말 기쁠 것 같아요.<br/>
                                    여러분도 새로운 가족과의 특별한 만남, 함께 시작해보시는 건 어떨까요?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 통계 섹션 */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">유기동물 현황</h2>
                    <p className="text-center text-gray-600 mb-12">반려동물 인구 1,500만 시대, 유기견·유기묘 문제는 심각한 사회 이슈입니다</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-8 shadow-md text-center">
                                <div className="text-5xl font-bold text-amber-500 mb-2">
                                    {stat.number}
                                    <span className="text-3xl ml-1">{stat.unit}</span>
                                </div>
                                <p className="text-gray-600 mt-4 leading-relaxed">{stat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 기획 배경 섹션 */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">기획 배경</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 카드 1: 유기동물 문제의 심각성 */}
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <Image
                                src="/about1.jpg"
                                alt="유기동물 문제"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                                <h3 className="text-2xl font-bold mb-4">심각한 사회 이슈</h3>
                                <p className="leading-relaxed text-gray-100">
                                    반려동물 인구 1,500만 시대에 유기견·유기묘 문제도 심각한 사회 이슈입니다.
                                    해마다 많은 반려동물이 버려지거나 길을 잃고 보호소로 들어오지만,
                                    충분한 입양이 이루어지지 않아 상당수가 안락사되거나 보호소에 장기체류하는 실정입니다.
                                </p>
                            </div>
                        </div>

                        {/* 카드 2: 입양률과 안락사 */}
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <Image
                                src="/about2.jpg"
                                alt="입양 현황"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                                <h3 className="text-2xl font-bold mb-4">낮은 입양률</h3>
                                <p className="leading-relaxed text-gray-100">
                                    2023년 한 해 동안 전국에서 구조된 유실·유기동물은 11만 3천 마리에 달했는데,
                                    이 중 약 39%만이 주인에게 반환되거나 새 가족에게 입양되고
                                    나머지는 자연사하거나 안락사 등으로 처리되었습니다.
                                </p>
                            </div>
                        </div>

                        {/* 카드 3: 재정적 부담 */}
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <Image
                                src="/about3.jpg"
                                alt="재정적 부담"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                                <h3 className="text-2xl font-bold mb-4">증가하는 예산</h3>
                                <p className="leading-relaxed text-gray-100">
                                    지자체와 동물보호센터들이 유기동물 관리를 위해 투입하는 예산도 매년 증가하여
                                    2023년에는 관련 비용이 처음으로 300억 원을 돌파하며 역대 최고치를 기록했습니다.
                                    이는 동물복지 차원뿐 아니라 재정적 측면에서도 지속 가능한 해법이 필요함을 보여줍니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hello PET 솔루션 섹션 */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Hello PET이 제공하는 솔루션</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p><strong className="text-gray-900 text-xl">"Hello PET" 웹앱</strong>은 각지의 유기동물 보호센터와 잠재 입양자를 직접 연결하는 온라인 입양 중개 플랫폼입니다. 보호소 직원이나 구조자가 보호 중인 동물의 정보와 사진을 올리면, 입양을 원하는 사람들이 그것을 보고 입양 신청을 할 수 있습니다.</p>
                        <p>또한 잃어버린 반려동물을 찾는 <strong className="text-gray-900">실종/보호 동물 게시판</strong>도 마련하여, 주인을 잃은 동물이 보호소로 가기 전에 지역 주민들 사이에서 빠르게 재회될 수 있도록 돕습니다.</p>
                        <p>이 플랫폼을 통해 유기동물의 입양률을 높이고 보호소의 부담을 줄이는 한편, 반려동물 유기 문제에 대한 인식 개선에도 기여할 수 있습니다.</p>
                    </div>
                </div>
            </section>

            {/* 마무리 섹션 */}
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        더 많은 동물들이<br/>
                        따뜻한 가족을 만날 수 있도록<br/>
                        함께해주세요
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        여러분의 작은 관심이 소중한 생명을 구합니다
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/announcements"
                            className="inline-block bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors shadow-md"
                        >
                            입양 게시판 보러가기
                        </Link>
                        <Link
                            href="/feed"
                            className="inline-block bg-white text-amber-500 border-2 border-amber-500 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-md"
                        >
                            커뮤니티 둘러보기
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

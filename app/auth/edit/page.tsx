"use client";
import RequireRole from "@/app/components/RequireRole";
import api from "@/app/lib/api";
import { UserDetailData, useUserStore } from "@/app/store/UserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/; // 영문·숫자·특수문자 포함 6자+
const KOREAN_REGEX = /^[가-힣]+$/;
const ENGLISH_REGEX = /^[A-Za-z]+$/;

export default function EditPage() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const currentUser = useUserStore((s) => s.user);
  const setCurrentUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  /* ✅ “건드렸는지” 상태 */
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* 제출 시 true → 모든 에러 표시 */
  const [submitted, setSubmitted] = useState(false);

  /* 에러 메시지 */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const isFormValid =
    PASSWORD_REGEX.test(password) &&
    !errors.password &&
    !errors.passwordCheck &&
    nickname &&
    nicknameChecked &&
    !errors.nickname &&
    address &&
    !errors.address;

  useEffect(() => {
    getUserDetail();
  }, []);

  // 2) user 가 바뀌는 순간에만 폼 값 초기화
  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setAddress(user.address);
      setProfileUrl(user.profileUrl);
    }
  }, [user]);
  useEffect(() => {
    validate(); // 한 글자만 바뀌어도 즉시 재검사
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, passwordCheck, address, nickname]);

  async function getUserDetail() {
    try {
      const res = await api.get<UserDetailData>("/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ── 한번이라도 텍스트 입력 했는지 체크 ─────────────────── */

  const markTouched =
    (field: string, setter: (v: string) => void, markPhone = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setTouched((t) => ({
        ...t,
        [field]: true,
        ...(markPhone ? { phone: true } : {}),
      }));
    };

  const checkNicname = async () => {
    try {
      const res = await api.get("/users/exist", {
        params: {
          field: "NICKNAME",
          value: nickname,
        },
      });
      if (!res.data.result) {
        setNicknameChecked(true);
        alert(res.data.message);
      }
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      alert(`중복확인 실패: ${msg}`);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    // 비밀번호
    if (!PASSWORD_REGEX.test(password))
      errs.password = "영문, 숫자, 특수문자를 포함해 6자 이상이어야 합니다.";
    if (password !== passwordCheck)
      errs.passwordCheck = "비밀번호가 일치하지 않습니다.";

    // 주소
    if (!address) errs.address = "주소는 필수입니다.";

    if (!nickname) {
      errs.nickname = "닉네임은 필수입니다.";
    } else if (KOREAN_REGEX.test(nickname) && nickname.length < 2) {
      errs.nickname = "한글 닉네임은 최소 2자 이상이어야 합니다.";
    } else if (ENGLISH_REGEX.test(nickname) && nickname.length < 5) {
      errs.nickname = "영문 닉네임은 최소 5자 이상이어야 합니다.";
    } else if (!KOREAN_REGEX.test(nickname) && !ENGLISH_REGEX.test(nickname)) {
      errs.nickname = "닉네임은 한글 또는 영문자만 사용할 수 있습니다.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-red-500">
        유저 정보를 불러올 수 없습니다.
      </div>
    );
  }

  /* ── 제출 ────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1) 마지막 유효성 검사
    if (!validate()) return;

    // 2) 백엔드 DTO(UserRegisterRequest)에 맞춰 페이로드 구성
    const payload = {
      password,
      nickname,
      address,
      userProfileUrl: profileUrl || null,
    };
    try {
      const res = await api.put("/me", payload);
      const email = currentUser?.email;
      console.log(res);
      clearUser();
      await api.delete("/auth/logout");
      await api.post("/auth/login", { email, password }).then((res) => {
        setCurrentUser(res.data);
      });
      alert("정보 수정이 완료되었습니다!");
      router.push("/me");
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      alert(`정보 수정 실패: ${msg}`);
    }
  };

  return (
    <RequireRole allow={["USER", "ADMIN", "SHELTER"]} fallback="/auth/login">
      <div className="flex flex-col min-h-screen items-center justify-center bg-white">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-widest text-amber-400">
          회원 정보 수정
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 w-[500px]">
          {/* 이메일 */}
          <div className="flex items-center">
            <input
              value={user.email}
              type="email"
              disabled
              readOnly
              placeholder="이메일"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 
      disabled:text-gray-500 
      disabled:cursor-not-allowed"
            />
          </div>

          {/* 비밀번호 */}
          <input
            value={password}
            onChange={markTouched("password", setPassword)}
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
          />
          <input
            value={passwordCheck}
            onChange={markTouched("passwordCheck", setPasswordCheck)}
            type="password"
            placeholder="비밀번호 확인"
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
          />
          {(errors.password || errors.passwordCheck) &&
            (touched.password || submitted) && (
              <p className="text-xs text-red-500">
                {errors.password ?? errors.passwordCheck}
              </p>
            )}

          {/* 이름 & 닉네임 */}
          <input
            value={user.username}
            type="text"
            placeholder="이름 (2~10자)"
            disabled
            readOnly
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 
      disabled:text-gray-500 
      disabled:cursor-not-allowed"
          />

          <div className="flex items-center">
            <input
              value={nickname}
              onChange={(e) => {
                markTouched("nickname", setNickname)(e);
                setNicknameChecked(false);
              }}
              type="text"
              placeholder="닉네임"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={checkNicname}
              disabled={!nickname || Boolean(errors.nickname)}
              className="ml-3 flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              중복확인
            </button>
          </div>
          {errors.nickname && (touched.nickname || submitted) && (
            <p className="text-xs text-red-500">{errors.nickname}</p>
          )}
          {/* 주소 */}
          <input
            value={address}
            onChange={markTouched("address", setAddress)}
            type="text"
            placeholder="주소"
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
          />
          {errors.address && (touched.address || submitted) && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
          {/* 프로필 URL */}
          <input
            value={profileUrl}
            onChange={markTouched("profileUrl", setProfileUrl)}
            type="url"
            placeholder="프로필 사진 URL"
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
          />

          {/* 휴대폰 번호 */}
          <div className="flex items-center gap-3">
            <input
              value={user.phoneNumber}
              placeholder="휴대전화"
              disabled
              readOnly
              className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 
      disabled:text-gray-500 
      disabled:cursor-not-allowed"
            />
          </div>

          {/* 제출 */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="mt-4 w-full rounded-lg bg-amber-400 py-3 font-semibold text-white shadow-md transition 
                   hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            수정하기
          </button>
          {/* 회원 탈퇴 이동 */}
          <Link
            href="/auth/withdraw"
            className="mt-3 block w-full rounded-lg bg-red-500 py-3 text-center font-semibold text-white shadow-md transition 
             hover:bg-red-600"
          >
            회원 탈퇴하기
          </Link>
        </form>
      </div>
    </RequireRole>
  );
}

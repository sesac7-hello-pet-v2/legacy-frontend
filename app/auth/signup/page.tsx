// app/(auth)/signup/page.tsx
"use client";

import RequireRole from "@/app/components/RequireRole";
import api from "@/app/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

/* ── 역할 매핑 ─────────────────────────────────────────────── */
const ROLE_LABELS = ["유저", "보호소", "관리자"] as const;
type RoleLabel = (typeof ROLE_LABELS)[number];
const roleLabelToCode: Record<RoleLabel, "USER" | "SHELTER" | "ADMIN"> = {
  유저: "USER",
  보호소: "SHELTER",
  관리자: "ADMIN",
};

/* ── 정규식 상수 ───────────────────────────────────────────── */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/; // 영문·숫자·특수문자 포함 6자+
const PHONE_REGEX = /^\d{3}-\d{4}-\d{4}$/; // 010-0000-0000
const KOREAN_REGEX = /^[가-힣]+$/;
const ENGLISH_REGEX = /^[A-Za-z]+$/;

export default function SignupPage() {
  /* ── 상태 ──────────────────────────────────────────────── */
  const [role, setRole] = useState<RoleLabel>("유저");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);

  const router = useRouter();

  /* ✅ “건드렸는지” 상태 */
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* 제출 시 true → 모든 에러 표시 */
  const [submitted, setSubmitted] = useState(false);
  /* 에러 메시지 */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid =
    email &&
    !errors.email &&
    PASSWORD_REGEX.test(password) &&
    !errors.password &&
    !errors.passwordCheck &&
    username &&
    !errors.username &&
    nickname &&
    !errors.nickname &&
    address &&
    !errors.address &&
    phone1 &&
    phone2 &&
    phone3 &&
    emailChecked &&
    nicknameChecked &&
    phoneChecked &&
    !errors.phone;

  /* ── 실시간 유효성 검사 ──────────────────────────────── */
  useEffect(() => {
    validate(); // 한 글자만 바뀌어도 즉시 재검사
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    email,
    password,
    passwordCheck,
    username,
    address,
    nickname,
    phone1,
    phone2,
    phone3,
  ]);

  const validate = () => {
    const errs: Record<string, string> = {};

    // 이메일
    if (!email) errs.email = "이메일은 필수입니다.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email))
      errs.email = "유효하지 않은 이메일 형식입니다.";

    // 비밀번호
    if (!PASSWORD_REGEX.test(password))
      errs.password = "영문, 숫자, 특수문자를 포함해 6자 이상이어야 합니다.";
    if (password !== passwordCheck)
      errs.passwordCheck = "비밀번호가 일치하지 않습니다.";

    // 이름
    if (!username || username.length < 2 || username.length > 10)
      errs.username = "이름은 2~10자여야 합니다.";

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

    // 휴대폰 검사
    const phone = `${phone1}-${phone2}-${phone3}`;
    if (!PHONE_REGEX.test(phone)) {
      errs.phone = "휴대폰 번호는 010-0000-0000 형식이어야 합니다.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

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

  /* ── 중복 체크 부분 ───────────────────────────────────── */
  const checkEmail = async () => {
    try {
      const res = await api.get("/users/exist", {
        params: {
          field: "EMAIL",
          value: email,
        },
      });
      if (!res.data.result) {
        setEmailChecked(true);
        alert(res.data.message);
      }
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      alert(`중복확인 실패: ${msg}`);
    }
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

  const checkPhone = async () => {
    try {
      const res = await api.get("/users/exist", {
        params: {
          field: "PHONE",
          value: phone1 + phone2 + phone3,
        },
      });
      if (!res.data.result) {
        setPhoneChecked(true);
        alert(res.data.message);
      }
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      alert(`중복확인 실패: ${msg}`);
    }
  };

  /* ── 제출 ────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1) 마지막 유효성 검사
    if (!validate()) return;

    // 2) 백엔드 DTO(UserRegisterRequest)에 맞춰 페이로드 구성
    const payload = {
      email,
      password,
      role: roleLabelToCode[role], // "USER" | "SHELTER" | "ADMIN"
      nickname,
      username,
      address,
      phoneNumber: `${phone1}${phone2}${phone3}`, // 11자리 숫자
      userProfileUrl: profileUrl || null,
    };
    try {
      const res = await api.post("/users/signup", payload);
      console.log(res);
      alert("회원가입이 완료되었습니다!");
      router.push("/auth/login");
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      alert(`회원가입 실패: ${msg}`);
    }
  };

  /* ── UI ──────────────────────────────────────────────── */
  return (
    <RequireRole notAllow={["USER", "ADMIN", "SHELTER"]}>
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-2xl p-10 shadow-[0_0_0_4px_rgba(253,224,71,0.25)]">
          {/* 역할 선택 */}
          <div className="mb-6 flex justify-center gap-4">
            {ROLE_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setRole(label)}
                className={`rounded-full border px-4 py-1 text-sm transition ${
                  role === label
                    ? "border-amber-400 bg-amber-400 text-white"
                    : "border-gray-300 text-gray-600 hover:border-amber-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h1 className="mb-8 text-center text-3xl font-bold tracking-widest text-amber-400">
            {role} 회원가입
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div className="flex items-center">
              <input
                value={email}
                onChange={(e) => {
                  markTouched("email", setEmail)(e);
                  setEmailChecked(false);
                }}
                type="email"
                placeholder="이메일"
                className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={checkEmail}
                disabled={!email || Boolean(errors.email)}
                type="button"
                className="ml-3 flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                중복확인
              </button>
            </div>
            {errors.email && (touched.email || submitted) && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}

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
              value={username}
              onChange={markTouched("username", setUsername)}
              type="text"
              placeholder="이름 (2~10자)"
              className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            {errors.username && (touched.username || submitted) && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}

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
                value={phone1}
                onChange={(e) => {
                  markTouched("phone1", setPhone1, true)(e);
                  setPhoneChecked(false);
                }}
                maxLength={3}
                className="w-1/4 rounded-lg px-2 py-3 text-center shadow focus:ring-2 focus:ring-amber-400"
              />
              <input
                value={phone2}
                onChange={(e) => {
                  markTouched("phone2", setPhone2, true)(e);
                  setPhoneChecked(false);
                }}
                maxLength={4}
                className="w-1/4 rounded-lg px-2 py-3 text-center shadow focus:ring-2 focus:ring-amber-400"
              />
              <input
                value={phone3}
                onChange={(e) => {
                  markTouched("phone3", setPhone3, true)(e);
                  setPhoneChecked(false);
                }}
                maxLength={4}
                className="w-1/4 rounded-lg px-2 py-3 text-center shadow focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={checkPhone}
                disabled={
                  // phone1/2/3이 모두 채워져 있고, regex를 통과할 때만 활성화
                  !phone1 || !phone2 || !phone3 || Boolean(errors.phone)
                }
                className="ml-3 flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                중복확인
              </button>
            </div>
            {errors.phone && (touched.phone || submitted) && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}

            {/* 제출 */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="mt-4 w-full rounded-lg bg-amber-400 py-3 font-semibold text-white shadow-md transition 
                   hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              가입하기
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-amber-400 hover:underline"
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}

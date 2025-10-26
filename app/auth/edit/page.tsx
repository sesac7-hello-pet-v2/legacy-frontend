"use client";
import api from "@/app/lib/api";
import { UserDetailData, useUserStore } from "@/app/store/UserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { modalAlert } from "@/app/utils/alertUtils";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/; // 영문·숫자·특수문자 포함 6자+
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/; // 한글, 영문, 숫자 조합 2-10자

export default function EditPage() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");

  // 입력용 임시 state
  const [nicknameInput, setNicknameInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [profileUrlInput, setProfileUrlInput] = useState("");

  const currentUser = useUserStore((s) => s.user);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    if (user) {
      setNicknameInput(user.nickname);
      setAddressInput(user.address);
      setProfileUrlInput(user.profileUrl || "");
    }
  }, [user]);

  async function getUserDetail() {
    try {
      const res = await api.get<UserDetailData>("/v1/users");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const checkNickname = async () => {
    if (!NICKNAME_REGEX.test(nicknameInput)) {
      await modalAlert("닉네임은 한글, 영문, 숫자 조합으로 2-10자여야 합니다.", "warning");
      return;
    }
    try {
      const res = await api.get("/v1/users/exist", {
        params: {
          field: "NICKNAME",
          value: nicknameInput,
        },
      });
      if (!res.data.result) {
        setNicknameChecked(true);
        await modalAlert(res.data.message, "success");
      }
    } catch (error) {
      const msg = (error as Error).message || "알 수 없는 오류가 발생했습니다.";
      await modalAlert(`중복확인 실패: ${msg}`, "error");
    }
  };

  const updateNickname = async () => {
    if (!nicknameChecked) {
      await modalAlert("닉네임 중복확인을 해주세요.", "warning");
      return;
    }
    if (!user) return;
    try {
      await api.put("/v1/users", {
        nickname: nicknameInput,
        address: user.address,
        userProfileUrl: user.profileUrl || null
      });
      await modalAlert("닉네임이 수정되었습니다.", "success");
      setNicknameChecked(false);
      await getUserDetail();
      window.location.reload();
    } catch (error) {
      await modalAlert("닉네임 수정 실패: " + (error as Error).message, "error");
    }
  };

  const updateAddress = async () => {
    if (!addressInput) {
      await modalAlert("주소를 입력해주세요.", "warning");
      return;
    }
    if (!user) return;
    try {
      await api.put("/v1/users", {
        nickname: user.nickname,
        address: addressInput,
        userProfileUrl: user.profileUrl || null
      });
      await modalAlert("주소가 수정되었습니다.", "success");
      await getUserDetail();
      window.location.reload();
    } catch (error) {
      await modalAlert("주소 수정 실패: " + (error as Error).message, "error");
    }
  };

  const updateProfileUrl = async () => {
    if (!user) return;
    try {
      await api.put("/v1/users", {
        nickname: user.nickname,
        address: user.address,
        userProfileUrl: profileUrlInput || null
      });
      await modalAlert("프로필 사진이 수정되었습니다.", "success");
      await getUserDetail();
      window.location.reload();
    } catch (error) {
      await modalAlert("프로필 사진 수정 실패: " + (error as Error).message, "error");
    }
  };

  const updatePassword = async () => {
    if (!PASSWORD_REGEX.test(password)) {
      await modalAlert("영문, 숫자, 특수문자를 포함해 6자 이상이어야 합니다.", "warning");
      return;
    }
    try {
      await api.put("/v1/users/password", { password });
      await modalAlert("비밀번호가 수정되었습니다.", "success");
      setPassword("");
      window.location.reload();
    } catch (error) {
      await modalAlert("비밀번호 수정 실패: " + (error as Error).message, "error");
    }
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

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white py-10">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-widest text-amber-400">
        회원 정보 수정
      </h1>

      <div className="space-y-6 w-[500px]">
        {/* 프로필 사진 미리보기 */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileUrlInput || user.profileUrl || "/basic_profile.jpg"}
            alt="Profile Preview"
            className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-amber-400"
            onError={(e) => {
              e.currentTarget.src = "/basic_profile.jpg";
            }}
          />
          <p className="mt-2 text-sm text-gray-500">프로필 사진 미리보기</p>
        </div>

        {/* 프로필 URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">프로필 사진 URL</label>
          <div className="flex items-center gap-3">
            <input
              value={profileUrlInput}
              onChange={(e) => setProfileUrlInput(e.target.value)}
              type="url"
              placeholder="프로필 사진 URL"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={updateProfileUrl}
              disabled={profileUrlInput === (user.profileUrl || "")}
              className="flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              수정
            </button>
          </div>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
          <input
            value={user.email}
            type="email"
            disabled
            readOnly
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          />
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
          <input
            value={user.username}
            type="text"
            disabled
            readOnly
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          />
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">휴대전화</label>
          <input
            value={user.phoneNumber}
            disabled
            readOnly
            className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
          <div className="flex items-center gap-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 6자 이상"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={updatePassword}
              disabled={!password}
              className="flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              수정
            </button>
          </div>
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">닉네임</label>
          <div className="flex items-center gap-3">
            <input
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
                setNicknameChecked(false);
              }}
              type="text"
              placeholder="한글, 영문, 숫자 2-10자"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={nicknameChecked ? updateNickname : checkNickname}
              disabled={!nicknameInput || nicknameInput === user.nickname}
              className="flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nicknameChecked ? "수정" : "중복확인"}
            </button>
          </div>
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">주소</label>
          <div className="flex items-center gap-3">
            <input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              type="text"
              placeholder="주소"
              className="flex-grow rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={updateAddress}
              disabled={!addressInput || addressInput === user.address}
              className="flex-none whitespace-nowrap rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              수정
            </button>
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <Link
          href="/auth/withdraw"
          className="mt-6 block w-full rounded-lg bg-red-500 py-3 text-center font-semibold text-white shadow-md transition hover:bg-red-600"
        >
          회원 탈퇴하기
        </Link>
      </div>
    </div>
  );
}

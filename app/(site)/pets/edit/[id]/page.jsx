"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id;

  useEffect(() => {
    if (petId) {
      // 상세 페이지로 리다이렉트
      router.replace(`/pets/${petId}`);
    }
  }, [petId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-gray-500">페이지를 이동 중...</p>
    </div>
  );
}

"use client";

import { useUserStore } from "@/app/store/UserStore";
import { useEffect } from "react";

interface PageProps {
    params: { id: string };
}

export default function FormPage({ params }: PageProps) {
    const { id } = params;
    const user = useUserStore((s) => s.user);

    async function submitData() {
        try {
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <div>
            <h1>Form for Announcement ID: {id}</h1>
            <h1>Form for Announcement 이름: {user?.nickname}</h1>
            <h1>Form for Announcement 전화번호: {user?.profileUrl}</h1>
            <h1>Form for Announcement 이메일: {user?.email}</h1>
            <button onClick={submitData}>서버로 전성</button>
        </div>
    );
}

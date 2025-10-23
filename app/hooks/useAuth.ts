import {useUserStore} from "@/app/store/UserStore";
import {useRouter} from "next/navigation";
import {useCallback} from "react";

export function useAuth() {
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const requireAuth = useCallback((action?: () => void) => {
        if (!user) {
            router.push("/auth/login");
            return false;
        }

        if (action) {
            action();
        }
        return true;
    }, [user, router]);

    const isAuthenticated = !!user;

    return {
        user,
        isAuthenticated,
        requireAuth
    };
}

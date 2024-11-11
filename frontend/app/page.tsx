"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/produtos");
    }, [router]);

    return null;
};

export default HomePage;

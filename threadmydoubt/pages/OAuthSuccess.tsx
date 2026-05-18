import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { User } from "../types";

const OAuthSuccess = ({ setUser }: { setUser: (user: User) => void }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // OPTIONAL: fetch user from backend
            fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
    if (data && data.user) {
        localStorage.setItem("threadMyDoubt-user", JSON.stringify(data.user));

        // 🔥 THIS IS THE FIX
        setUser(data.user);

        navigate("/dashboard");
    } else {
        navigate("/login");
    }
})
            .catch(() => {
                navigate("/login");
            });

        } else {
            navigate("/login");
        }
    }, [navigate, setUser]);

    return <div className="text-center mt-20">Logging you in...</div>;
};

export default OAuthSuccess;
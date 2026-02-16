import Image from "next/image";
import { LoginForm } from "./components/LoginForm";
import { BackgroundEffects } from "./components/BackgroundEffects";

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Background landscape - Server Side (except next/image optimization) */}
            <div className="absolute inset-0">
                <Image
                    src="/images/landscape.png"
                    alt="Sunrise landscape with mountains and a winding path"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1a2e]/60 via-[#1a1a2e]/20 to-transparent" />
            </div>

            {/* Client-side Login Card */}
            <LoginForm />

            {/* Client-side Decorative Elements */}
            <BackgroundEffects />
        </div>
    );
}

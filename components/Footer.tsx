import Link from "next/link"
import { Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background-dark mt-20">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-sm">

                <div className="flex items-center gap-2">
                    🔥 <span className="font-semibold text-white">MoltRoast</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="hover:text-white transition">
                        Privacy Policy
                    </Link>

                    <Link href="/terms" className="hover:text-white transition">
                        Terms of Service
                    </Link>

                    <Link
                        href="https://x.com/Sujay__Raj"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition"
                    >
                        <Twitter size={18} />
                        <span>Follow @Sujay__Raj</span>
                    </Link>
                </div>

            </div>
        </footer>
    )
}

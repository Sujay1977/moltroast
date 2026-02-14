'use client'

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 bg-background-dark/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl font-bold mt-6 animate-pulse">Heating up the burns...</p>
            <p className="text-white/40 text-sm mt-2">This may take 15-30 seconds</p>
        </div>
    )
}

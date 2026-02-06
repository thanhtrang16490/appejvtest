import { Loader2 } from 'lucide-react'

export default function SalesLoading() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse" />
                <Loader2 className="w-10 h-10 text-primary animate-spin absolute inset-0 m-auto" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="font-black text-sm uppercase tracking-widest text-primary animate-pulse">Sales App</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-70">Đang tải dữ liệu...</p>
            </div>
        </div>
    )
}

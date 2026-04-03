"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-red-100 p-4 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Lỗi không mong muốn
                        </h1>
                        <p className="text-gray-600">
                            Đã xảy ra lỗi khi xử lý yêu cầu của bạn.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 font-mono break-words">
                            {error.message ||
                                "Lỗi không rõ ràng. Vui lòng thử lại."}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-600 mt-2">
                                ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={reset}
                            className="w-full gap-2"
                            size="lg"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Thử lại
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Về trang chủ
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-2 text-center text-sm text-gray-500">
                        <p>Nếu vấn đề vẫn tiếp tục,</p>
                        <p>vui lòng liên hệ với bộ phận hỗ trợ.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

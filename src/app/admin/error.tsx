"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin page error:", error);
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
                            Lỗi trang quản trị
                        </h1>
                        <p className="text-gray-600">
                            Đã xảy ra lỗi khi tải dữ liệu hoặc xử lý yêu cầu của
                            bạn.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 font-mono break-words">
                            {error.message ||
                                "Lỗi không rõ ràng. Vui lòng thử lại."}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-600 mt-2">
                                ID lỗi: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                            <strong>Gợi ý:</strong> Vấn đề này có thể do dữ liệu
                            không hợp lệ hoặc kết nối server bị gián đoạn. Vui
                            lòng thử lại hoặc kiểm tra dữ liệu.
                        </p>
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
                            <Link href="/admin">
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại trang quản trị
                            </Link>
                        </Button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>Có thể các nguyên nhân:</p>
                        <ul className="list-disc list-inside">
                            <li>Dữ liệu từ server không hợp lệ</li>
                            <li>Kết nối mạng bị gián đoạn</li>
                            <li>Cache không đồng bộ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-orange-100 p-4 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="space-y-2 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                            404
                        </h1>
                        <p className="text-gray-600">
                            Trang bạn tìm kiếm không tồn tại.
                        </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-700">
                            Có thể đường dẫn bị sai hoặc trang đã bị xóa.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full" size="lg">
                            <Link href="/">Về trang chủ</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            <Link href="/admin">Về trang quản trị</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

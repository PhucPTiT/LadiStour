"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/service/auth/AuthService";
import { toast } from "sonner";
import { ADMIN_AUTH_EVENT } from "@/components/admin/auth";
import { StarfieldBackground } from "@/components/ui/starfield";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginValues) => {
        setIsLoading(true);
        try {
            const response = await login(values.username, values.password);

            toast.success(`Welcome back, ${response.fullName}!`);

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
            }

            router.replace("/admin");
        } catch (error) {
            console.error("Login error:", error);

            toast.error(
                "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin và thử lại.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mx-auto flex min-h-[calc(100vh-48px)] w-full items-center justify-center overflow-hidden px-4">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarfieldBackground />
            </div>

            {/* Login Card */}
            <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border bg-slate-700 shadow-[0_30px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl">
                <CardHeader className="space-y-2 border-b border-black/5 px-8 py-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] ">
                        STOUR CMS
                    </p>

                    <CardTitle className="text-2xl font-bold tracking-tight ">
                        Admin Login
                    </CardTitle>

                    <p className="text-sm text-neutral-500">
                        Sign in to manage your dashboard
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 px-8 ">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label
                                className="text-sm font-medium "
                                htmlFor="username"
                            >
                                Username
                            </Label>
                            <Input
                                id="username"
                                placeholder="admin"
                                disabled={isLoading}
                                className="h-11 rounded-xlpx-4 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-900"
                                {...register("username")}
                            />
                            {errors.username ? (
                                <p className="text-xs text-red-600">
                                    {errors.username.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label
                                className="text-sm font-medium "
                                htmlFor="password"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className="h-11 rounded-xl px-4 pr-11 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-900"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                    tabIndex={-1}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password ? (
                                <p className="text-xs text-red-600">
                                    {errors.password.message}
                                </p>
                            ) : null}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-11 w-full rounded-xl  text-sm font-semibold shadow-md transition active:scale-[0.98]"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} STOUR CMS. All rights
                        reserved.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

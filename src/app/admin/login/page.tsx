"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdminAuth } from "@/components/admin/auth";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
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

    const onSubmit = (values: LoginValues) => {
        console.log("ADMIN_LOGIN", values);
        setAdminAuth(true);
        router.replace("/admin");
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-lg items-center justify-center">
            <Card className="w-full border-neutral-200 shadow-[0_24px_40px_rgba(15,23,42,0.08)]">
                <CardHeader className="space-y-2 border-b border-neutral-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        STOUR CMS
                    </p>
                    <CardTitle className="text-2xl text-neutral-900">
                        Admin Login
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="admin"
                                {...register("username")}
                            />
                            {errors.username ? (
                                <p className="text-xs text-red-600">
                                    {errors.username.message}
                                </p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            {errors.password ? (
                                <p className="text-xs text-red-600">
                                    {errors.password.message}
                                </p>
                            ) : null}
                        </div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

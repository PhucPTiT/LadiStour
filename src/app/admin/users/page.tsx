"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const userSchema = z.object({
    _id: z.string().optional(),
    username: z.string().min(1, "Username is required"),
    passwordHash: z.string().min(1, "Password hash is required"),
    fullName: z.string().min(1, "Full name is required"),
    role: z.enum(["admin", "editor", "viewer"]),
    isActive: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type UserValues = z.infer<typeof userSchema>;

const defaultValues: UserValues = {
    _id: "",
    username: "",
    passwordHash: "",
    fullName: "",
    role: "admin",
    isActive: true,
    createdAt: "",
    updatedAt: "",
};

export default function AdminUsersPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UserValues>({
        resolver: zodResolver(userSchema),
        defaultValues,
    });

    const onSubmit = (values: UserValues) => {
        console.log("USERS", values);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Users
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit admin users
                </h2>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>User details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="_id">ID</Label>
                        <Input id="_id" {...register("_id")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username")} />
                        {errors.username ? (
                            <p className="text-xs text-red-600">
                                {errors.username.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="passwordHash">Password hash</Label>
                        <Input id="passwordHash" {...register("passwordHash")} />
                        {errors.passwordHash ? (
                            <p className="text-xs text-red-600">
                                {errors.passwordHash.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input id="fullName" {...register("fullName")} />
                        {errors.fullName ? (
                            <p className="text-xs text-red-600">
                                {errors.fullName.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Controller
                            control={control}
                            name="role"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-800">
                                Active
                            </p>
                            <p className="text-xs text-neutral-500">
                                Allow this user to sign in.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="isActive"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="createdAt">Created at</Label>
                        <Input
                            id="createdAt"
                            type="datetime-local"
                            {...register("createdAt")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="updatedAt">Updated at</Label>
                        <Input
                            id="updatedAt"
                            type="datetime-local"
                            {...register("updatedAt")}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">Save user</Button>
            </div>
        </form>
    );
}

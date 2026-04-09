"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createBooking } from "@/service/booking/BookingService";

export default function BookingForm() {
    const t = useTranslations("BookingPage.form");
    const tValidation = useTranslations("BookingPage.validation");
    const [submitted, setSubmitted] = useState(false);

    const BookingFormSchema = z.object({
        name: z
            .string()
            .min(2, tValidation("name.minLength"))
            .max(100, tValidation("name.maxLength")),
        email: z.string().email(tValidation("email.invalid")),
        phone: z
            .string()
            .min(9, tValidation("phone.minLength"))
            .regex(/^[\d\s\+\-\(\)]+$/, tValidation("phone.invalid")),
        message: z
            .string()
            .min(10, tValidation("message.minLength"))
            .max(1000, tValidation("message.maxLength")),
    });

    type BookingFormData = z.infer<typeof BookingFormSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BookingFormData>({
        resolver: zodResolver(BookingFormSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: BookingFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await createBooking(data);
            setSubmitted(true);
            reset();
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Failed to submit booking:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
            <div className="mb-8">
                <h2 className="font-heading text-3xl font-bold text-neutral-900">
                    {t("title")}
                </h2>
                <p className="mt-2 text-neutral-600">{t("description")}</p>
            </div>

            {submitted && (
                <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                    <p className="text-primary-happysmile font-medium">
                        {t("successMessage")}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                        {t("nameLabel")}
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        placeholder={t("namePlaceholder")}
                        className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-primary-happysmile focus:outline-none focus:ring-1 focus:ring-primary-happysmile"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                        {t("emailLabel")}
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Phone Field */}
                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                        {t("phoneLabel")}
                    </label>
                    <input
                        {...register("phone")}
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                        {t("messageLabel")}
                    </label>
                    <textarea
                        {...register("message")}
                        placeholder={t("messagePlaceholder")}
                        rows={5}
                        className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                    />
                    {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.message.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-primary-happysmile px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-happysmile/90 hover:scale-[1.02] disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isSubmitting ? t("submitting") : t("submitButton")}
                </button>
            </form>
        </div>
    );
}

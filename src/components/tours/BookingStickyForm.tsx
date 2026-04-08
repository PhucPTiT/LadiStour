"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import z from "zod";
import { createBooking } from "@/service/booking/BookingService";

type BookingStickyFormProps = {
    tourTitle: string;
};

export default function BookingStickyForm({
    tourTitle,
}: BookingStickyFormProps) {
    const t = useTranslations("BookingStickyForm");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tValidation = useTranslations("BookingPage.validation");

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
            .min(1, tValidation("message.minLength"))
            .max(1000, tValidation("message.maxLength")),

        numberOfGuests: z.number().optional(),
        nameTour: z.string().optional(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<z.infer<typeof BookingFormSchema>>({
        resolver: zodResolver(BookingFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
            numberOfGuests: 2,
            nameTour: tourTitle,
        },
    });

    // Đảm bảo nameTour luôn được cập nhật khi tourTitle thay đổi
    useEffect(() => {
        setValue("nameTour", tourTitle);
    }, [tourTitle, setValue]);

    const onSubmit = async (data: z.infer<typeof BookingFormSchema>) => {
        try {
            setError(null);
            const payloadData = {
                ...data,
                nameTour: tourTitle,
            };
            await createBooking(payloadData);
            setSubmitted(true);
            reset({
                name: "",
                email: "",
                phone: "",
                message: "",
                numberOfGuests: 2,
                nameTour: tourTitle,
            });

            // Reset submitted message sau 3 giây
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An error occurred while submitting the form.";
            setError(errorMessage);
            console.error("Booking error:", err);
        }
    };

    const getInputClassName = (hasError: boolean) =>
        `h-11 w-full rounded-xl border ${
            hasError ? "border-red-500" : "border-neutral-200"
        } px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-0`;

    const getTextareaClassName = (hasError: boolean) =>
        `w-full rounded-xl border ${
            hasError ? "border-red-500" : "border-neutral-200"
        } px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-0`;

    const errorMessageClassName = "text-xs text-red-500 mt-1";

    return (
        <aside className="sticky top-28 rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.08)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                {t("bookingInquiry")}
            </p>
            <h3 className="mt-2 font-heading text-xl text-neutral-900">
                {tourTitle}
            </h3>

            {error && (
                <div className="mt-3 rounded-lg bg-red-50 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
                {/* Name */}
                <div>
                    <input
                        {...register("name")}
                        placeholder={t("yourName")}
                        className={getInputClassName(!!errors.name)}
                    />
                    {errors.name && (
                        <p className={errorMessageClassName}>
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder={t("emailAddress")}
                        className={getInputClassName(!!errors.email)}
                    />
                    {errors.email && (
                        <p className={errorMessageClassName}>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <input
                        {...register("phone")}
                        placeholder={t("phoneNumber")}
                        className={getInputClassName(!!errors.phone)}
                    />
                    {errors.phone && (
                        <p className={errorMessageClassName}>
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                {/* Number of Guests */}
                <div>
                    <input
                        {...register("numberOfGuests", {
                            valueAsNumber: true,
                        })}
                        type="number"
                        min={1}
                        placeholder={t("numberOfGuests")}
                        className={getInputClassName(!!errors.numberOfGuests)}
                    />
                    {errors.numberOfGuests && (
                        <p className={errorMessageClassName}>
                            {errors.numberOfGuests.message}
                        </p>
                    )}
                </div>

                {/* Message */}
                <div>
                    <textarea
                        {...register("message")}
                        rows={4}
                        placeholder={t("message")}
                        className={getTextareaClassName(!!errors.message)}
                    />
                    {errors.message && (
                        <p className={errorMessageClassName}>
                            {errors.message.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:opacity-70"
                >
                    {isSubmitting ? t("sending") : t("preSalesRequest")}
                </button>
            </form>

            {submitted ? (
                <p className="mt-3 text-sm text-emerald-700">
                    {t("successMessage")}
                </p>
            ) : null}
        </aside>
    );
}

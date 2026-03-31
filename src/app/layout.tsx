import type { ReactNode } from "react";
import "./globals.css";
import { Lora, Figtree } from "next/font/google";

const figtreeHeading = Figtree({subsets:['latin'],variable:'--font-heading'});

const lora = Lora({subsets:['latin'],variable:'--font-serif'});


type Props = {
    children: ReactNode;
};

export default function RootLayout({ children }: Props) {
    return children;
}

import { Suspense } from "react";
import NavBar from "./header/NavBar";
import TopBar from "./header/TopBar";

export default function Header() {
    return (
        <header className="sticky top-0 z-50">
            <TopBar />
            <Suspense fallback={null}>
                <NavBar />
            </Suspense>
        </header>
    );
}

import React from "react";

export const metadata = {
    title: "Next.js",
    desccription: "Next.js is the React framework for production",
};

export default function DashboardLayout({
    children,
}:{children: React.ReactNode}) 
{
    return (
        <html lang="en">
            DASHBOARD HEADER
            <body>
                    {children}
            </body>
        </html>
    );
}

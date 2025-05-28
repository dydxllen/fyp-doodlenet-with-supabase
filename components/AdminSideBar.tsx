"use client";
import { useRouter, usePathname } from "next/navigation";
import { PiStudent, PiExam } from "react-icons/pi";
import { useState } from "react";

const navItems = [
	{
		label: "Student List",
		icon: <PiStudent size={28} />,
		href: "/admin",
	},
	{
		label: "Test Results",
		icon: <PiExam size={28} />,
		href: "/admin/test-results",
	},
];

export default function AdminSideBar() {
	const router = useRouter();
	const pathname = usePathname();
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className={`
        fixed top-0 left-0 h-full z-50
        flex flex-col items-center py-20
        bg-blue-500
        transition-all duration-200
        ${hovered ? "w-48 shadow-2xl" : "w-14"}
      `}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				minHeight: "100vh",
				boxShadow: hovered ? "2px 0 16px rgba(0,0,0,0.15)" : undefined,
			}}
		>
			<div className="flex flex-col gap-4 w-full">
				{navItems.map((item) => (
					<button
						key={item.label}
						onClick={() => router.push(item.href)}
						className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors
              ${pathname === item.href ? "bg-blue-800 text-white" : "text-white hover:bg-blue-700"}
            `}
						style={{
							justifyContent: hovered ? "flex-start" : "center",
							gap: hovered ? "0.75rem" : "0",
						}}
					>
						{item.icon}
						<span
							className={`whitespace-nowrap transition-all duration-200
                ${hovered ? "opacity-100 ml-3 w-auto" : "opacity-0 ml-0 w-0 overflow-hidden"}
              `}
							style={{
								pointerEvents: hovered ? "auto" : "none",
								fontWeight: 500,
								fontSize: "1rem",
							}}
						>
							{item.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

"use client";
import { useRouter, usePathname } from "next/navigation";
import { PiStudent, PiExam } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { useState } from "react";

// Navigation items for sidebar
const navItems = [
	{
		label: "Dashboard",
		icon: <MdOutlineSpaceDashboard size={28} />,
		href: "/admin",
	},
	{
		label: "Student List",
		icon: <PiStudent size={28} />,
		href: "/admin/students",
	},
	// {
	// 	label: "Test Results",
	// 	icon: <PiExam size={28} />,
	// 	href: "/admin/test-results",
	// },
];

// Sidebar navigation button component
function NavButton({ item, hovered, active, onClick }: any) {
	return (
		<button
			key={item.label}
			onClick={onClick}
			className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors
        ${active ? "bg-blue-800 text-white" : "text-white hover:bg-blue-700"}
      `}
			style={{
				justifyContent: hovered ? "flex-start" : "center",
				gap: hovered ? "0.75rem" : "0",
			}}
		>
			{item.icon}
			<span
				className={`whitespace-nowrap transition-all duration-200
          ${
						hovered
							? "opacity-100 ml-3 w-auto"
							: "opacity-0 ml-0 w-0 overflow-hidden"
					}
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
	);
}

export default function AdminSideBar() {
	const router = useRouter();
	const pathname = usePathname();
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className={`
        fixed top-0 left-0 h-full z-50
        flex flex-col items-center py-5
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
			{/* Logo at the top */}
			<div className="w-full flex justify-center mb-8">
				<img
					src="/doodle-it-logo.png"
					alt="Logo"
					className={`transition-all duration-200 ${
						hovered ? "w-20" : "w-8"
					} h-auto`}
					style={{
						objectFit: "contain",
						transition: "width 0.2s",
					}}
				/>
			</div>

			{/* Navigation buttons */}
			<div className="flex flex-col gap-4 w-full">
				{navItems.map((item) => (
					<NavButton
						key={item.label}
						item={item}
						hovered={hovered}
						active={pathname === item.href}
						onClick={() => router.push(item.href)}
					/>
				))}
			</div>
		</div>
	);
}

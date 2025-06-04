"use client";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSideBar from "@/components/AdminSideBar";
import StudentListTable from "./StudentListTable";

export default function AdminPage() {
  return (
    <div>
      <AdminSideBar />
      <div className="pl-14 transition-all duration-200">
        <AdminNavbar />
        <div className="p-4">
          <StudentListTable />
        </div>
      </div>
    </div>
  );
}

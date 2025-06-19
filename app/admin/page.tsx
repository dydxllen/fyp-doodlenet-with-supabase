"use client";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSideBar from "@/components/AdminSideBar";
import StudentStatsCards from "@/components/StudentStatsCards";
import StudentAgePieChart from "@/components/StudentAgePieChart";
import PrePostScoreBarChart from "@/components/PrePostScoreBarChart";
import VocabComparisonBarChart from "@/components/VocabComparisonBarChart";

export default function AdminDashboard() {
  return (
    <div>
      <AdminSideBar />
      <div className="pl-14 transition-all duration-200">
        <AdminNavbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          <div>
            <StudentStatsCards />
          </div>
          {/* Chart area: grid for multiple charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded shadow flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">
                Student Age Demographics
              </h2>
              <StudentAgePieChart />
            </div>
            <div className="bg-white p-6 rounded shadow flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">
                Average Pre-test vs Post-test Score by Age Group
              </h2>
              <PrePostScoreBarChart />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="bg-white p-6 rounded shadow flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">
                Vocabulary Comparison (Pre-test vs Post-test)
              </h2>
              <VocabComparisonBarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
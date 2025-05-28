"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSideBar from "@/components/AdminSideBar";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", age: "" });
  const [loading, setLoading] = useState(false);

  // Protect page: redirect if not logged in as admin
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.replace("/sign-in");
    }
  }, [router]);

  // Fetch students
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Sort students by student_id ascending
  const sortedStudents = [...students].sort(
    (a, b) => (a.student_id ?? 0) - (b.student_id ?? 0)
  );

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Find next student_id
    const maxId =
      students.length > 0
        ? Math.max(...students.map((s) => s.student_id ?? 0))
        : 0;
    const nextId = maxId + 1;

    // Insert new student
    const { error } = await supabase.from("students").insert([
      {
        student_id: nextId,
        name: form.name,
        age: Number(form.age),
      },
    ]);
    setLoading(false);
    if (error) {
      alert("Failed to add user: " + error.message);
    } else {
      setShowModal(false);
      setForm({ name: "", age: "" });
      fetchStudents();
    }
  };

  return (
    <div>
      <AdminSideBar />
      <div className="pl-14 transition-all duration-200">
        <AdminNavbar />
        <div className="p-4">
          <div className="mb-6 flex justify-center">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-md transition duration-300"
              onClick={() => setShowModal(true)}
            >
              Add User
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">Student’s List</h2>
          <table className="min-w-full border text-sm rounded-md shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border">Student ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Pre-test Score (x/15)</th>
                <th className="py-2 px-4 border">Post-test Score (x/15)</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{student.student_id}</td>
                  <td className="py-2 px-4 border">{student.name}</td>
                  <td className="py-2 px-4 border">{student.age}</td>
                  <td className="py-2 px-4 border">{student.pretest_score ?? '-'}</td>
                  <td className="py-2 px-4 border">{student.posttest_score ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Add User */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Add New Student</h3>
                <form onSubmit={handleAddUser}>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter student name"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      required
                      min={3}
                      max={6}
                      placeholder="Enter student age (3-6)"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-200"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-yellow-400 font-bold"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

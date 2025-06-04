import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudentListTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ student_id: "", name: "", age: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [editModal, setEditModal] = useState<null | any>(null);
  const [editForm, setEditForm] = useState({ name: "", age: "", pretest_score: "", posttest_score: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const [deleteModal, setDeleteModal] = useState<null | any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
      // Set next student_id as placeholder if not editing
      if (!showModal) {
        const maxId =
          (data && data.length > 0)
            ? Math.max(...data.map((s) => s.student_id ?? 0))
            : 0;
        setForm((prev) => ({ ...prev, student_id: (maxId + 1).toString() }));
      }
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort students by student_id based on sortOrder
  const sortedStudents = [...students].sort((a, b) => {
    const aId = a.student_id ?? 0;
    const bId = b.student_id ?? 0;
    return sortOrder === "asc" ? aId - bId : bId - aId;
  });

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!form.student_id) {
      setFormError("Student ID is required.");
      return;
    }
    if (!form.name) {
      setFormError("Name is required.");
      return;
    }
    if (!form.age) {
      setFormError("Age is required.");
      return;
    }
    const studentIdNum = Number(form.student_id);
    if (isNaN(studentIdNum) || studentIdNum <= 0) {
      setFormError("Student ID must be a positive number.");
      return;
    }
    // Check if student_id is taken
    const exists = students.some((s) => s.student_id === studentIdNum);
    if (exists) {
      setFormError("Student ID is already taken. Please choose another.");
      return;
    }

    setLoading(true);

    // Insert new student
    const { error } = await supabase.from("students").insert([
      {
        student_id: studentIdNum,
        name: form.name,
        age: Number(form.age),
      },
    ]);
    setLoading(false);
    if (error) {
      setFormError("Failed to add user: " + error.message);
    } else {
      setShowModal(false);
      setForm({ student_id: "", name: "", age: "" });
      fetchStudents();
    }
  };

  // Edit handlers
  const handleEdit = (student: any) => {
    setEditForm({
      name: student.name ?? "",
      age: student.age?.toString() ?? "",
      pretest_score: student.pretest_score?.toString() ?? "",
      posttest_score: student.posttest_score?.toString() ?? "",
    });
    setEditModal(student);
    setEditSuccess(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setEditLoading(true);
    const { error } = await supabase
      .from("students")
      .update({
        name: editForm.name,
        age: Number(editForm.age),
        pretest_score: editForm.pretest_score === "" ? null : Number(editForm.pretest_score),
        posttest_score: editForm.posttest_score === "" ? null : Number(editForm.posttest_score),
      })
      .eq("student_id", editModal.student_id);
    setEditLoading(false);
    if (!error) {
      setEditSuccess(true);
      fetchStudents();
      setTimeout(() => {
        setEditModal(null);
      }, 1200);
    }
  };

  // Delete handlers
  const handleDelete = (student: any) => {
    setDeleteModal(student);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    await supabase.from("students").delete().eq("student_id", deleteModal.student_id);
    setDeleteLoading(false);
    setDeleteModal(null);
    fetchStudents();
  };

  return (
    <div>
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
            <th
              className="py-2 px-4 border cursor-pointer select-none"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title="Sort by Student ID"
            >
              Student ID
              <span className="ml-1">
                {sortOrder === "asc" ? "▲" : "▼"}
              </span>
            </th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Age</th>
            <th className="py-2 px-4 border">Pre-test Score (x/15)</th>
            <th className="py-2 px-4 border">Post-test Score (x/15)</th>
            <th className="py-2 px-4 border">Edit</th>
            <th className="py-2 px-4 border">Delete</th>
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
              <td className="py-1 px-1 border align-middle text-center">
                <button title="Edit Student"
                  className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-3 rounded-lg font-semibold"
                  onClick={() => handleEdit(student)}
                >
                  <FiEdit />
                </button>
              </td>
              <td className="py-1 px-1 border align-middle text-center">
                <button title="Delete Student"
                  className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-3 rounded-lg font-semibold"
                  onClick={() => handleDelete(student)}
                >
                  <RiDeleteBinLine />
                </button>
              </td>
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
                <label className="block mb-1 font-medium">Student ID</label>
                <input
                  type="number"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                  min={1}
                  placeholder="Student ID"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
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
              {formError && (
                <div className="mb-4 text-red-600 font-semibold text-center">
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => {
                    setShowModal(false);
                    setFormError(null);
                    // Reset form to default: next student id, empty name and age
                    const maxId =
                      students.length > 0
                        ? Math.max(...students.map((s) => s.student_id ?? 0))
                        : 0;
                    setForm({ student_id: (maxId + 1).toString(), name: "", age: "" });
                  }}
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

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Edit Student</h3>
            <form onSubmit={handleEditSave}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name</label>
                <input
                  title="Edit Student Name"
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Age</label>
                <input
                  title="Edit Student Age"
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditFormChange}
                  required
                  min={3}
                  max={6}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Pre-test Score</label>
                <input
                  type="number"
                  name="pretest_score"
                  value={editForm.pretest_score}
                  onChange={handleEditFormChange}
                  min={0}
                  max={15}
                  className="w-full border rounded px-3 py-2"
                  placeholder="(optional)"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Post-test Score</label>
                <input
                  type="number"
                  name="posttest_score"
                  value={editForm.posttest_score}
                  onChange={handleEditFormChange}
                  min={0}
                  max={15}
                  className="w-full border rounded px-3 py-2"
                  placeholder="(optional)"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setEditModal(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-500 text-white font-bold"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
              {editSuccess && (
                <div className="mt-4 text-green-600 font-semibold text-center">
                  Student info has been updated!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirmation</h3>
            <div className="mb-2">
              Name: <span className="font-semibold">{deleteModal.name}</span>
              <br />
              Age: <span className="font-semibold">{deleteModal.age}</span>
            </div>
            <div className="mb-4">
              Are you sure you want to delete the selected row? This action cannot be undone.
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setDeleteModal(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-bold"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
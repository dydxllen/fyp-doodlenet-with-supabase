import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';

export default async function Page() {
  try {
    const supabase = await createClient();
    const { data: students, error } = await supabase.from('students').select();

    if (error) {
      console.error('Error fetching students:', error.message);
      return (
        <div>
          <Navbar />
          <div className="mt-20 p-4">
            <h1>Error</h1>
            <p>Failed to fetch students: {error.message}</p>
          </div>
        </div>
      );
    }

    if (!students || students.length === 0) {
      return (
        <div>
          <Navbar />
          <div className="mt-20 p-4">
            <p>No students found.</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Navbar />
        <div className="mt-20 p-4">
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
              {students.map((student) => (
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

          <div className="mt-6 flex justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-md transition duration-300">
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Error:', error.message);
    return (
      <div>
        <Navbar />
        <div className="mt-20 p-4">
          <h1>Error</h1>
          <p>Failed to fetch students: {error.message}</p>
        </div>
      </div>
    );
  }
}

import { useState } from "react";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const [selectName, setSelectName] = useState("");
  const [age, setAge] = useState("");

  // Dummy user data (replace with actual database call later)
  const users = [
    { name: "Alice", age: 5 },
    { name: "Bob", age: 6 },
    { name: "Charlie", age: 7 },
  ];

  // Update age based on selected name
  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find((user) => user.name === event.target.value);
    setSelectName(selectedUser ? selectedUser.name : "");
    setAge(selectedUser ? selectedUser.age.toString() : "");
  };

    // Update age based on selected name
    const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedUser = users.find((user) => user.name === event.target.value);
      setSelectedName(selectedUser ? selectedUser.name : "");
      setAge(selectedUser ? selectedUser.age.toString() : "");
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white font-poppins text-text">
        {/* Header */}
        <div className="w-full bg-primary p-4 flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 ml-4" />
          <div className="ml-auto mr-4 cursor-pointer">
            <div className="h-1 w-6 bg-black mb-1"></div>
            <div className="h-1 w-6 bg-black mb-1"></div>
            <div className="h-1 w-6 bg-black"></div>
          </div>
        </div>
  
        {/* Logo and Title */}
        <div className="my-8 text-center">
          <img src="/logo-sample.png" alt="Doodle It Out" className="w-40 mx-auto" />
          <h2 className="text-lg font-semibold mt-2">DOODLE IT OUT</h2>
          <p className="text-gray-500 text-sm">Learn vocabulary the fun way</p>
        </div>
  
        <form className="flex flex-col w-80">
          {/* Name Dropdown */}
          <label className="font-semibold text-lg mb-2">Select Name</label>
          <select
            className="w-full bg-gray-300 p-3 rounded-lg text-lg font-semibold"
            value={selectName}
            onChange={handleNameChange}
            required
          >
            <option value="" disabled>Select your name</option>
            {users.map((user) => (
              <option key={user.name} value={user.name}>{user.name}</option>
            ))}
          </select>
  
          {/* Age Display */}
          <div className="w-full mt-4 bg-gray-300 p-3 rounded-lg text-lg font-semibold text-center">
            {age ? `Age: ${age}` : "Age (Populated data)"}
          </div>
  
          {/* Enter Button */}
          <SubmitButton
            pendingText="Signing In..."
            className="bg-secondary text-black font-bold py-3 px-10 rounded-lg mt-6 text-lg"
          >
            Enter
          </SubmitButton>
  
          {/* Teacher Login */}
          <div className="mt-10 text-center">
            <p className="text-sm">Are you a teacher?</p>
            <Link
              href="/admin"
              className="bg-accent text-white font-bold py-3 px-8 rounded-lg mt-2 text-lg inline-block"
            >
              I am a Teacher
            </Link>
          </div>
  
          <FormMessage message={searchParams} />
        </form>
      </div>
    );
}

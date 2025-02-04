import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AddEmployee from "./AddEmployee";

function App() {
  interface Employee {
    id?: number;
    name: string;
    email: string;
    department: string;
    designation: string;
  }

  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");

  const fetchEmployees = async () => {
    try {
      const savedEmployees = localStorage.getItem("employees");
      if (savedEmployees) {
        const parsedEmployees = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
        setFilteredEmployees(parsedEmployees);
      } else {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.company?.name || "Engineering",
          designation: "Software Engineer",
        }));
        setEmployees(data);
        setFilteredEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const nameMatch = employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const departmentMatch =
        !departmentFilter || employee.department === departmentFilter;
      return nameMatch && departmentMatch;
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, departmentFilter, employees]);

  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-8">
        Employee Dashboard
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[90%] lg:w-[70%] mx-auto mt-8 mb-8 border border-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="relative w-full sm:w-auto">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block p-2 ps-10 text-sm text-black-900 border border-gray-300 rounded-lg w-full sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Search Employee with name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 w-full sm:w-48"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
          <button
            type="button"
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg"
            onClick={() => setOpen(true)}
          >
            Add Employee
          </button>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Designation</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.department}</td>
                <td className="px-6 py-4">{item.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <AddEmployee
          setOpen={setOpen}
          setEmployees={setEmployees}
          employees={employees}
        />
      )}
    </>
  );
}

export default App;

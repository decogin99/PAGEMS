import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import EmployeeCard from '../components/EmployeeCard';
import { useTheme } from '../context/ThemeContext';

const Employees = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDutyPlace, setFilterDutyPlace] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const { darkMode } = useTheme();

    // Sample data - replace with actual data source
    const employees = [
        { id: 1, name: 'John Doe', department: 'IT', dutyPlace: 'Head Office', placeOnDuty: 'D.I.S', position: 'Developer', email: 'john@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', department: 'HR', dutyPlace: 'Factory', placeOnDuty: 'P.A.G', position: 'Manager', email: 'jane@example.com', phone: '123-456-7891' },
        { id: 3, name: 'Harry Jame', department: 'Marketing', dutyPlace: 'Factory', placeOnDuty: 'P.A.G', position: 'Sale Manager', email: 'harry@example.com', phone: '123-456-7892' },
        { id: 4, name: 'Will Smith', department: 'Finance', dutyPlace: 'Head Office', placeOnDuty: 'P.A.G', position: 'Manager', email: 'will@example.com', phone: '123-456-7893' },
    ];

    const departments = ['all', 'IT', 'HR', 'Finance', 'Marketing'];

    const dutyPlaces = ['all', 'Head Office', 'Factory'];

    const handleExportExcel = () => {
        // Implement Excel export logic
        console.log('Exporting to Excel...');
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDutyPlace = filterDutyPlace === 'all' || employee.dutyPlace === filterDutyPlace;
        const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
        return matchesSearch && matchesDutyPlace && matchesDepartment;
    });

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employees</h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleExportExcel}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export
                                </button>
                                <button className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Employee
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm mb-6`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full h-10 pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                            placeholder="Search employees..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-2.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        name='dutyPlace'
                                        className={`w-full h-10 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                        value={filterDutyPlace}
                                        onChange={(e) => setFilterDutyPlace(e.target.value)}
                                    >
                                        {dutyPlaces.map(duty => (
                                            <option key={duty} value={duty}>
                                                {duty === 'all' ? 'Duty Place' : duty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        className={`w-full h-10 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>
                                                {dept === 'all' ? 'All Departments' : dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Employees Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredEmployees.map((employee) => (
                                <EmployeeCard key={employee.id} employee={employee} darkMode={darkMode} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Employees;
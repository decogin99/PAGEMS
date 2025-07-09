import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { darkMode } = useTheme();
    const [employee, setEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - in a real app, you would fetch this from an API based on the ID
    const employees = [
        { id: 1, name: 'John Doe', department: 'IT', dutyPlace: 'Head Office', placeOnDuty: 'D.I.S', position: 'Developer', email: 'john@example.com', phone: '123-456-7890', joinDate: '2020-05-15', address: '123 Main St, City', emergencyContact: 'Jane Doe (Wife) - 987-654-3210', skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], education: [{ degree: 'Bachelor of Science in Computer Science', institution: 'University of Technology', year: '2019' }] },
        { id: 2, name: 'Jane Smith', department: 'HR', dutyPlace: 'Factory', placeOnDuty: 'P.A.G', position: 'Manager', email: 'jane@example.com', phone: '123-456-7891', joinDate: '2019-03-10', address: '456 Oak St, Town', emergencyContact: 'John Smith (Husband) - 987-654-3211', skills: ['Recruitment', 'Employee Relations', 'Training & Development'], education: [{ degree: 'Master of Business Administration', institution: 'Business School', year: '2018' }] },
        { id: 3, name: 'Harry Jame', department: 'Marketing', dutyPlace: 'Factory', placeOnDuty: 'P.A.G', position: 'Sale Manager', email: 'harry@example.com', phone: '123-456-7892', joinDate: '2021-01-20', address: '789 Pine St, Village', emergencyContact: 'Mary Jame (Wife) - 987-654-3212', skills: ['Digital Marketing', 'Social Media', 'Content Creation'], education: [{ degree: 'Bachelor of Arts in Marketing', institution: 'Marketing University', year: '2020' }] },
        { id: 4, name: 'Will Smith', department: 'Finance', dutyPlace: 'Head Office', placeOnDuty: 'P.A.G', position: 'Manager', email: 'will@example.com', phone: '123-456-7893', joinDate: '2018-11-05', address: '101 Elm St, County', emergencyContact: 'Jada Smith (Wife) - 987-654-3213', skills: ['Financial Analysis', 'Budgeting', 'Forecasting'], education: [{ degree: 'Master of Finance', institution: 'Finance University', year: '2017' }] },
    ];

    // For the current user profile when accessed from navbar
    const currentUser = {
        id: 0,
        name: 'Thu Htoo Aung',
        department: 'IT',
        dutyPlace: 'Head Office',
        placeOnDuty: 'D.I.S',
        position: 'Senior Developer',
        email: 'thuhtoo@example.com',
        phone: '123-456-7899',
        joinDate: '2017-08-10',
        address: '202 Cedar St, Metropolis',
        emergencyContact: 'Family Member - 987-654-3220',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        education: [
            { degree: 'Master of Computer Science', institution: 'Tech University', year: '2016' },
            { degree: 'Bachelor of Engineering', institution: 'Engineering College', year: '2014' }
        ],
        projects: [
            { name: 'PAGEMS Development', role: 'Lead Developer', period: 'Jan 2023 - Present' },
            { name: 'CRM System', role: 'Full Stack Developer', period: 'Mar 2021 - Dec 2022' },
            { name: 'E-commerce Platform', role: 'Frontend Developer', period: 'Jun 2019 - Feb 2021' }
        ]
    };

    useEffect(() => {
        // If id is 'me' or undefined, show current user profile
        if (!id || id === 'me') {
            setEmployee(currentUser);
            return;
        }

        // Find employee by ID
        const foundEmployee = employees.find(emp => emp.id === parseInt(id));
        if (foundEmployee) {
            setEmployee(foundEmployee);
        } else {
            // Handle case when employee is not found
            navigate('/employees');
        }
    }, [id, navigate]);

    if (!employee) {
        return (
            <div className={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0054A6]"></div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Back button */}
                        <button 
                            onClick={() => navigate(-1)}
                            className={`mb-4 flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        {/* Profile Header */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden mb-6`}>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                    <div className="w-32 h-32 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{employee.name}</h1>
                                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{employee.position}</p>
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{employee.department} • {employee.dutyPlace}</p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                            <a href={`mailto:${employee.email}`} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {employee.email}
                                            </a>
                                            <a href={`tel:${employee.phone}`} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {employee.phone}
                                            </a>
                                        </div>
                                    </div>
                                    {employee.id === 0 && (
                                        <div className="mt-4 md:mt-0">
                                            <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg transition-colors`}>
                                                <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                Edit Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Tabs */}
                            <div className={`flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-4 py-3 font-medium text-sm flex-1 text-center ${activeTab === 'overview' 
                                        ? (darkMode ? 'border-b-2 border-[#0054A6] text-[#4d8fd1]' : 'border-b-2 border-[#0054A6] text-[#0054A6]')
                                        : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                                >
                                    Overview
                                </button>
                                <button 
                                    onClick={() => setActiveTab('skills')}
                                    className={`px-4 py-3 font-medium text-sm flex-1 text-center ${activeTab === 'skills' 
                                        ? (darkMode ? 'border-b-2 border-[#0054A6] text-[#4d8fd1]' : 'border-b-2 border-[#0054A6] text-[#0054A6]')
                                        : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                                >
                                    Skills & Education
                                </button>
                                {employee.projects && (
                                    <button 
                                        onClick={() => setActiveTab('projects')}
                                        className={`px-4 py-3 font-medium text-sm flex-1 text-center ${activeTab === 'projects' 
                                            ? (darkMode ? 'border-b-2 border-[#0054A6] text-[#4d8fd1]' : 'border-b-2 border-[#0054A6] text-[#0054A6]')
                                            : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                                    >
                                        Projects
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Department</p>
                                                <p>{employee.department}</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Position</p>
                                                <p>{employee.position}</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Duty Place</p>
                                                <p>{employee.dutyPlace} ({employee.placeOnDuty})</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Join Date</p>
                                                <p>{new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Email</p>
                                                <p>{employee.email}</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Phone</p>
                                                <p>{employee.phone}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Address</p>
                                                <p>{employee.address}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Emergency Contact</p>
                                                <p>{employee.emergencyContact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {employee.skills.map((skill, index) => (
                                                <span 
                                                    key={index} 
                                                    className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education</h2>
                                        <div className="space-y-4">
                                            {employee.education.map((edu, index) => (
                                                <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{edu.degree}</h3>
                                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{edu.institution}</p>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Graduated: {edu.year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'projects' && employee.projects && (
                                <div>
                                    <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Projects</h2>
                                    <div className="space-y-4">
                                        {employee.projects.map((project, index) => (
                                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</h3>
                                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role: {project.role}</p>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.period}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
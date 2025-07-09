import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ employee, darkMode }) => {
    const navigate = useNavigate();

    return (
        <div className={`${darkMode ? 'bg-gray-800 hover:shadow-gray-700/10' : 'bg-white hover:shadow-md'} rounded-lg shadow-sm overflow-hidden transition-shadow`}>
            <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>{employee.name}</h3>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>{employee.position}</div>
                <div className="space-y-2">
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {employee.department}
                    </div>
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                        </svg>
                        {employee.dutyPlace} ({employee.placeOnDuty})
                    </div>
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {employee.email}
                    </div>
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {employee.phone}
                    </div>
                </div>
                <div className="flex justify-between mt-6 gap-2">
                    <button
                        onClick={() => navigate(`/profile/${employee.id}`)}
                        className={`flex-1 px-3 py-2 ${darkMode ? 'text-[#4d8fd1] hover:bg-[#4d8fd1] hover:text-white border-[#4d8fd1]' : 'text-[#0054A6] hover:bg-[#0054A6] hover:text-white border-[#0054A6]'} rounded-lg border transition-colors text-sm`}
                    >
                        Profile
                    </button>
                    <button className={`flex-1 px-3 py-2 ${darkMode ? 'text-yellow-500 hover:bg-yellow-600 hover:text-white border-yellow-500' : 'text-yellow-600 hover:bg-yellow-600 hover:text-white border-yellow-600'} rounded-lg border transition-colors text-sm`}>
                        Edit
                    </button>
                    <button className={`flex-1 px-3 py-2 ${darkMode ? 'text-red-500 hover:bg-red-600 hover:text-white border-red-500' : 'text-red-600 hover:bg-red-600 hover:text-white border-red-600'} rounded-lg border transition-colors text-sm`}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCard;

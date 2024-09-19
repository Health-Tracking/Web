import React, { useContext } from 'react';
import { PatientContext } from './App';

const Aside = () => {
    const { searchTerm, setSearchTerm } = useContext(PatientContext);

    return (
        <div className="layout-content-container flex flex-col w-80">
            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded h-full">
                        <input
                            type="text"
                            placeholder="환자 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </label>
            </div>
            <PatientList />
        </div>
    );
};

const PatientList = () => {
    const { patients, setSelectedPatient, searchTerm } = useContext(PatientContext);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {filteredPatients.map((patient) => (
                <div
                    key={patient.id}
                    className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedPatient(patient)}
                >
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit" style={{ backgroundImage: `url("${patient.image}")` }}></div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{patient.name}</p>
                        <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">나이: {patient.age}, ID: {patient.id}</p>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Aside;
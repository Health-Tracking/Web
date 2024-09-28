import React, { useContext } from 'react';
import { PatientContext } from './App';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const Aside = () => {
    const { searchTerm, setSearchTerm, patients, setPatients, user } = useContext(PatientContext);

    const addPatient = async () => {
        const newPatient = {
            name: "새 환자",
            age: "정보 없음",
            id: Date.now(),
            image: "정보 없음",
            gender: "정보 없음",
            height: "정보 없음",
            weight: "정보 없음",
            bmi: "정보 없음",
            bloodType: "정보 없음",
            medicalHistory: [
                { icon: "정보 없음", title: "정보 없음", description: "정보 없음" },
                { icon: "정보 없음", title: "정보 없음", description: "정보 없음" }
            ],
            medications: [
                { icon: "정보 없음", name: "정보 없음", instruction: "정보 없음" },
                { icon: "정보 없음", name: "정보 없음", instruction: "정보 없음" }
            ],
            vitals: [
                { title: "", change: "", data: [] },
                { title: "", change: "", data: [] },
                { title: "", change: "", data: [] }
            ],
            labResults: [
                { icon: "정보 없음", name: "정보 없음", lastChecked: "정보 없음" },
                { icon: "정보 없음", name: "정보 없음", lastChecked: "정보 없음" }
            ]
        };

        try {
            const docRef = await addDoc(collection(db, `users/${user.uid}/patients`), newPatient);
            console.log("Document written with ID: ", docRef.id);
            setPatients([{ ...newPatient, id: docRef.id }, ...patients]);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

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
            <div className="w-full px-4">
                <button onClick={addPatient} className="mb-4 p-2 bg-blue-500 text-white rounded w-full">환자 추가</button>
            </div>
            <div className='overflow-y-auto h-[calc(100vh-)]'>
                <PatientList />
            </div>

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
                        <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{patient.name || 'new Patient'}</p>
                        <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">나이: {patient.age || 'No Info'}, ID: {patient.id || 'No Info'}</p>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Aside;
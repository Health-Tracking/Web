import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firestore 인스턴스 가져오기
import Header from './Header';

const Settings = () => {
    const { userId } = useParams();
    const [doctorInfo, setDoctorInfo] = useState({
        name: '',
        age: '',
        specialty: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log("User ID:", userId); // userId가 올바르게 출력되는지 확인
        const fetchDoctorInfo = async () => {
            if (!userId) {
                console.error("User ID is undefined");
                return;
            }
            const docRef = doc(db, 'doctors', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setDoctorInfo(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchDoctorInfo();
    }, [userId]);

    const handleChange = (field, value) => {
        setDoctorInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const docRef = doc(db, 'doctors', userId);
        await updateDoc(docRef, doctorInfo);
        setIsEditing(false);
    };

    return (
        <div className="layout-content-container flex flex-col flex-1">
            <Header />
            <div className="flex items-center justify-between p-5">
                <h2 className="text-lg font-bold">Settings</h2>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="text-gray-500 rounded text-sm font-medium leading-normal"
                >
                    {isEditing ? '저장' : '수정'}
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4 px-5">
                {['name', 'age', 'specialty', 'email'].map((field) => (
                    <div key={field} className="flex items-center border-t border-t-[#E0E0E0] py-5">
                        <label className="text-sm font-medium w-1/4">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={doctorInfo[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="text-[#141414] text-sm font-normal leading-normal focus:outline-none px-1 border-none w-3/4"
                            />
                        ) : (
                            <p className="text-[#141414] text-sm font-normal leading-normal w-3/4">{doctorInfo[field] || '정보 없음'}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;

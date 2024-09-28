import React, { useContext, useState, useEffect } from 'react';
import { PatientContext } from './App';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './index.css'; // 커스텀 스타일 추가

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Main = () => {
    const { selectedPatient, setPatients, updatePatientInFirestore } = useContext(PatientContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);

    useEffect(() => {
        if (selectedPatient) {
            setEditedPatient(selectedPatient);
        }
    }, [selectedPatient]);

    const handleSave = async () => {
        if (editedPatient) {
            await updatePatientInFirestore(editedPatient);
            setPatients(prevPatients =>
                prevPatients.map(p =>
                    p.id === editedPatient.id ? editedPatient : p
                )
            );
            setIsEditing(false);
        }
    };

    if (!selectedPatient) {
        return <div className="flex justify-center items-center h-full">환자를 선택해주세요.</div>;
    }

    return (
        <div className="layout-content-container flex flex-col flex-1 p-4">
            <PatientHeader
                patient={editedPatient}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                setEditedPatient={setEditedPatient}
            />
            <PatientInfo patient={editedPatient} isEditing={isEditing} setEditedPatient={setEditedPatient} />
            <Vitals patient={editedPatient} />
            <MedicalHistory patient={editedPatient} isEditing={isEditing} setEditedPatient={setEditedPatient} />
            <Medications patient={editedPatient} isEditing={isEditing} setEditedPatient={setEditedPatient} />
            <LabResults patient={editedPatient} isEditing={isEditing} setEditedPatient={setEditedPatient} />
        </div>
    );
};

const PatientHeader = ({ patient, isEditing, setIsEditing, handleSave, setEditedPatient }) => {
    const handleNameChange = (e) => {
        setEditedPatient(prev => ({ ...prev, name: e.target.value }));
    };

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex-grow max-w-[calc(100%-80px)]">
                {isEditing ? (
                    <input
                        type="text"
                        value={patient?.name || ''}
                        onChange={handleNameChange}
                        className="text-[32px] tracking-light font-bold leading-tight whitespace-nowrap bg-transparent border-none focus:outline-none w-full"
                    />
                ) : (
                    <p className="text-[32px] tracking-light font-bold leading-tight whitespace-nowrap truncate">{patient?.name || '새 환자'}</p>
                )}
            </div>
            <div className="flex-shrink-0 ml-4">
                <button
                    className="text-gray-500 rounded text-sm font-medium leading-normal"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    {isEditing ? '저장' : '수정'}
                </button>
            </div>
        </div>
    );
};

const PatientInfo = ({ patient, isEditing, setEditedPatient }) => {
    const handleChange = (field, value) => {
        setEditedPatient(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <InfoItem label="성별" value={patient?.gender} field="gender" isEditing={isEditing} onChange={handleChange} />
            <InfoItem label="나이" value={patient?.age} field="age" isEditing={isEditing} onChange={handleChange} />
            <InfoItem label="키" value={patient?.height} field="height" isEditing={isEditing} onChange={handleChange} />
            <InfoItem label="체중" value={patient?.weight} field="weight" isEditing={isEditing} onChange={handleChange} />
            <InfoItem label="BMI" value={patient?.bmi} field="bmi" isEditing={isEditing} onChange={handleChange} />
            <InfoItem label="혈액형" value={patient?.bloodType} field="bloodType" isEditing={isEditing} onChange={handleChange} />
        </div>
    );
};

const InfoItem = ({ label, value, field, isEditing, onChange }) => (
    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E0E0E0] py-5">
        <p className="text-neutral-500 text-sm font-normal leading-normal">{label}</p>
        {isEditing ? (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(field, e.target.value)}
                className="text-[#141414] text-sm font-normal leading-normal focus:outline-none px-1 border-none"
                style={{ minWidth: '20px' }}
            />
        ) : (
            <p className="text-[#141414] text-sm font-normal leading-normal">{value || '정보 없음'}</p>
        )}
    </div>
);

const MedicalHistory = ({ patient, isEditing, setEditedPatient }) => {
    const handleChange = (index, field, value) => {
        setEditedPatient(prev => ({
            ...prev,
            medicalHistory: prev.medicalHistory.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">의료 기록</h3>
            {patient?.medicalHistory?.map((history, index) => (
                <HistoryItem key={index} icon={history.icon} title={history.title} description={history.description} isEditing={isEditing} onChange={(field, value) => handleChange(index, field, value)} />
            ))}
        </>
    );
};

const HistoryItem = ({ icon, title, description, isEditing, onChange }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center w-full">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={title || ''}
                        onChange={(e) => onChange('title', e.target.value)}
                        className="text-[#141414] text-base font-medium leading-normal line-clamp-1 focus:outline-none px-2 py-1 rounded mb-1 border-none"
                    />
                    <input
                        type="text"
                        value={description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2 focus:outline-none px-2 py-1 rounded border-none"
                    />
                </>
            ) : (
                <>
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{title || '정보 없음'}</p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">{description || '정보 없음'}</p>
                </>
            )}
        </div>
    </div>
);

const Medications = ({ patient, isEditing, setEditedPatient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">약물</h3>
            {patient?.medications?.map((medication, index) => (
                <MedicationItem key={index} icon={medication.icon} name={medication.name || '정보 없음'} instruction={medication.instruction || '정보 없음'} />
            ))}
        </>
    );
};

const MedicationItem = ({ icon, name, instruction, isEditing, onChange }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center w-full">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={name || ''}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="text-[#141414] text-base font-medium leading-normal line-clamp-1 focus:outline-none px-2 py-1 rounded mb-1 border-none"
                    />
                    <input
                        type="text"
                        value={instruction || ''}
                        onChange={(e) => onChange('instruction', e.target.value)}
                        className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2 focus:outline-none px-2 py-1 rounded border-none"
                    />
                </>
            ) : (
                <>
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{name || '정보 없음'}</p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">{instruction || '정보 없음'}</p>
                </>
            )}
        </div>
    </div>
);

const Vitals = ({ patient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">생체 신호</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
                {patient?.vitals?.map((vital, index) => (
                    <VitalChart key={index} title={vital.title} change={vital.change} data={vital.data} />
                ))}
            </div>
        </>
    );
};

const VitalChart = ({ title, change, data }) => {
    const today = new Date();
    const labels = Array.from({ length: 5 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (4 - index)); // 오늘 날짜에서 0, 1, 2, 3, 4일 전
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // 월과 일만 표시
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data || [65, 59, 80, 81, 56], // 데이터가 없으면 기본값 용
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded border border-[#E0E0E0] p-6">
            <p className="text-[#141414] text-base font-medium leading-normal">{title}</p>
            <p className={`text-base font-medium leading-normal ${change.startsWith('+') ? 'text-[#189A4A]' : 'text-[#C3222A]'}`}>{change}</p>
            <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

const LabResults = ({ patient, isEditing, setEditedPatient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">검사 결과</h3>
            {patient?.labResults?.map((result, index) => (
                <LabResultItem key={index} icon={result.icon} name={result.name} lastChecked={result.lastChecked} />
            ))}
        </>
    );
};

const LabResultItem = ({ icon, name, lastChecked, isEditing, onChange }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center w-full">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={name || ''}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="text-[#141414] text-base font-medium leading-normal line-clamp-1 focus:outline-none px-2 py-1 rounded mb-1 border-none"
                    />
                    <input
                        type="text"
                        value={lastChecked || ''}
                        onChange={(e) => onChange('lastChecked', e.target.value)}
                        className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2 focus:outline-none px-2 py-1 rounded border-none"
                    />
                </>
            ) : (
                <>
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{name || '정보 없음'}</p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">마지막 검사일: {lastChecked || '정보 없음'}</p>
                </>
            )}
        </div>
    </div>
);

export default Main;
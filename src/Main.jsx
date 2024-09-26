import React, { useContext } from 'react';
import { PatientContext } from './App';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './index.css'; // 커스텀 스타일 추가

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Main = () => {
    const { selectedPatient } = useContext(PatientContext);

    if (!selectedPatient) {
        return <div className="flex justify-center items-center h-full">환자를 선택해주세요.</div>;
    }

    return (
        <div className="layout-content-container flex flex-col flex-1 p-4">
            <PatientHeader patient={selectedPatient} />
            <PatientInfo patient={selectedPatient} />
            <Vitals patient={selectedPatient} />
            <MedicalHistory patient={selectedPatient} />
            <Medications patient={selectedPatient} />
            <LabResults patient={selectedPatient} />
        </div>
    );
};

const PatientHeader = ({ patient }) => {
    return (
        <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[32px] tracking-light font-bold leading-tight min-w-72">{patient.name}</p>
        </div>
    );
};

const PatientInfo = ({ patient }) => {
    return (
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <InfoItem label="성별" value={patient.gender || '정보 없음'} />
            <InfoItem label="나이" value={patient.age || '정보 없음'} />
            <InfoItem label="키" value={patient.height || '정보 없음'} />
            <InfoItem label="체중" value={patient.weight || '정보 없음'} />
            <InfoItem label="BMI" value={patient.bmi || '정보 없음'} />
            <InfoItem label="혈액형" value={patient.bloodType || '정보 없음'} />
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E0E0E0] py-5">
        <p className="text-neutral-500 text-sm font-normal leading-normal">{label}</p>
        <p className="text-[#141414] text-sm font-normal leading-normal">{value}</p>
    </div>
);

const MedicalHistory = ({ patient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">의료 기록</h3>
            {patient.medicalHistory?.map((history, index) => (
                <HistoryItem key={index} icon={history.icon} title={history.title} description={history.description} />
            ))}
        </>
    );
};

const HistoryItem = ({ icon, title, description }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{title}</p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">{description}</p>
        </div>
    </div>
);

const Medications = ({ patient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">약물</h3>
            {patient.medications?.map((medication, index) => (
                <MedicationItem key={index} icon={medication.icon} name={medication.name} instruction={medication.instruction} />
            ))}
        </>
    );
};

const MedicationItem = ({ icon, name, instruction }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{name}</p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">{instruction}</p>
        </div>
    </div>
);

const Vitals = ({ patient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">생체 신호</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
                {patient.vitals?.map((vital, index) => (
                    <VitalChart key={index} title={vital.title} change={vital.change} data={vital.data} />
                ))}
            </div>
        </>
    );
};

const VitalChart = ({ title, change, data }) => {
    const chartData = {
        labels: ['7월 1일', '7월 8일', '7월 15일', '7월 22일', '7월 29일'],
        datasets: [
            {
                label: title,
                data: data || [65, 59, 80, 81, 56], // 데이터가 없으면 기본값 사용
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

const LabResults = ({ patient }) => {
    return (
        <>
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">검사 결과</h3>
            {patient.labResults?.map((result, index) => (
                <LabResultItem key={index} icon={result.icon} name={result.name} lastChecked={result.lastChecked} />
            ))}
        </>
    );
};

const LabResultItem = ({ icon, name, lastChecked }) => (
    <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-[72px] py-2">
        <div className="text-[#141414] flex items-center justify-center rounded bg-[#F4F4F4] shrink-0 size-12">
            {/* 아이콘 컴포넌트 추가 필요 */}
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{name}</p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">마지막 검사일: {lastChecked}</p>
        </div>
    </div>
);

export default Main;


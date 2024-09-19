import React, { useState, createContext, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Aside from './Aside';

export const PatientContext = createContext();

const App = () => {
  const [patients, setPatients] = useState([
    {
      name: "Katy Perry",
      age: 39,
      id: 1234,
      image: "https://cdn.usegalileo.ai/stability/29009bcf-5eca-4a5a-9d63-f4b7f7f60feb.png",
      gender: "여성",
      height: "170cm",
      weight: "61kg",
      bmi: "21.1",
      bloodType: "A+",
      medicalHistory: [
        { icon: "Heart", title: "고혈압", description: "2019년 진단, 약물 치료 중" },
        { icon: "Bone", title: "골다공증", description: "2021년 진단, 정기 검진 중" }
      ],
      medications: [
        { icon: "Pill", name: "리시노프릴", instruction: "매일 아침 1정 복용" },
        { icon: "Pill", name: "칼슘 보충제", instruction: "매일 저녁 1정 복용" }
      ],
      vitals: [
        { title: "혈압", change: "-5%", data: [120, 118, 115, 117, 114] },
        { title: "혈당", change: "+2%", data: [95, 98, 97, 99, 97] },
        { title: "심박수", change: "0%", data: [72, 75, 73, 76, 74] }
      ],
      labResults: [
        { icon: "Flask", name: "콜레스테롤 검사", lastChecked: "2023년 5월 15일" },
        { icon: "Flask", name: "갑상선 기능 검사", lastChecked: "2023년 6월 1일" }
      ]
    },
    {
      name: "Taylor Swift",
      age: 34,
      id: 1235,
      image: "https://cdn.usegalileo.ai/stability/6eaca8ff-f3a0-4762-956a-caedc5a45ddc.png",
      gender: "여성",
      height: "180cm",
      weight: "63kg",
      bmi: "19.4",
      bloodType: "O-",
      medicalHistory: [
        { icon: "Lungs", title: "천식", description: "어린 시절부터, 흡입기 사용 중" },
        { icon: "Eye", title: "근시", description: "교정시력 -2.5" }
      ],
      medications: [
        { icon: "Inhaler", name: "알부테롤", instruction: "필요시 흡입" },
        { icon: "Pill", name: "비타민 D", instruction: "매일 아침 1정 복용" }
      ],
      vitals: [
        { title: "혈압", change: "+3%", data: [110, 112, 115, 113, 114] },
        { title: "혈당", change: "-1%", data: [90, 89, 88, 89, 89] },
        { title: "심박수", change: "0%", data: [68, 70, 69, 68, 68] }
      ],
      labResults: [
        { icon: "Flask", name: "알레르기 검사", lastChecked: "2023년 4월 20일" },
        { icon: "Flask", name: "비타민 D 수치", lastChecked: "2023년 7월 5일" }
      ]
    },
    {
      name: "Selena Gomez",
      age: 31,
      id: 1236,
      image: "https://cdn.usegalileo.ai/stability/b5fbd8ee-1391-4ad9-9ec8-ecee82021819.png",
      gender: "여성",
      height: "165cm",
      weight: "59kg",
      bmi: "21.7",
      bloodType: "B+",
      medicalHistory: [
        { icon: "Kidney", title: "루푸스", description: "2015년 진단, 정기적 관리 중" },
        { icon: "Brain", title: "불안장애", description: "2018년 진단, 치료 중" }
      ],
      medications: [
        { icon: "Pill", name: "하이드록시클로로퀸", instruction: "매일 2회 복용" },
        { icon: "Pill", name: "프레드니손", instruction: "의사 지시에 따라 복용" }
      ],
      vitals: [
        { title: "혈압", change: "-2%", data: [110, 108, 109, 107, 108] },
        { title: "혈당", change: "+1%", data: [85, 86, 86, 87, 86] },
        { title: "심박수", change: "-5%", data: [75, 72, 70, 68, 71] }
      ],
      labResults: [
        { icon: "Flask", name: "신장 기능 검사", lastChecked: "2023년 8월 10일" },
        { icon: "Flask", name: "항핵항체 검사", lastChecked: "2023년 8월 10일" }
      ]
    },
    {
      name: "Ariana Grande",
      age: 30,
      id: 1237,
      image: "https://cdn.usegalileo.ai/stability/d4f2f2dd-7d84-4b44-8cb4-ad794afe94e1.png",
      gender: "여성",
      height: "153cm",
      weight: "47kg",
      bmi: "20.1",
      bloodType: "AB+",
      medicalHistory: [
        { icon: "Ear", title: "이명", description: "2019년부터 간헐적 증상" },
        { icon: "Brain", title: "PTSD", description: "2017년 진단, 치료 중" }
      ],
      medications: [
        { icon: "Pill", name: "세르트랄린", instruction: "매일 저녁 1정 복용" },
        { icon: "Pill", name: "메라토닌", instruction: "취침 전 필요시 복용" }
      ],
      vitals: [
        { title: "혈압", change: "-3%", data: [105, 103, 102, 101, 102] },
        { title: "혈당", change: "+1%", data: [80, 81, 81, 82, 81] },
        { title: "심박수", change: "-2%", data: [75, 73, 72, 71, 73] }
      ],
      labResults: [
        { icon: "Flask", name: "청력 검사", lastChecked: "2023년 9월 1일" },
        { icon: "Flask", name: "호르몬 검사", lastChecked: "2023년 7월 15일" }
      ]
    }
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  return (
    <PatientContext.Provider value={{ patients, selectedPatient, setSelectedPatient, searchTerm, setSearchTerm }}>
      <div className="relative flex size-full min-h-screen flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="gap-1 px-6 flex flex-1 justify-center py-5">
            <Aside />
            <Main />
          </div>
        </div>
      </div>
    </PatientContext.Provider>
  );
};

export default App;
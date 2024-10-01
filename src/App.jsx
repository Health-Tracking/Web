import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import Header from './Header';
import Aside from './Aside';
import Main from './Main';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Messages from './Messages';

export const PatientContext = React.createContext();

const App = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updatePatientInFirestore = async (updatedPatient) => {
    if (!user) return;
    try {
      const patientRef = doc(db, `users/${user.uid}/patients`, updatedPatient.id);
      await updateDoc(patientRef, updatedPatient);
      console.log("Patient updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating patient in Firestore:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchPatientsAndCreateIfEmpty(user.uid);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchPatientsAndCreateIfEmpty = async (userId) => {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/patients`));
    let patientsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    if (patientsData.length === 0) {
      const newPatient = await createNewPatient(userId);
      patientsData = [newPatient];
    }

    setPatients(patientsData);
    setSelectedPatient(patientsData[0]);
  };

  const createNewPatient = async (userId) => {
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
        { title: "산소 포화도", data: {} },
        { title: "혈당", data: {} },
        { title: "혈압", data: {} }
      ],
      labResults: [
        { icon: "정보 없음", name: "정보 없음", lastChecked: "정보 없음" },
        { icon: "정보 없음", name: "정보 없음", lastChecked: "정보 없음" }
      ],
      messages: [],
      lastMessageTimestamp: null,
      unreadMessageCount: 0
      // messages: 환자와의 메시지 기록을 저장하는 배열입니다. 각 메시지 객체는 다음과 같은 구조를 가질 수 있습니다:
      // lastMessageTimestamp: 가장 최근 메시지의 타임스탬프를 저장합니다. 이를 통해 메시지 목록을 정렬하거나 최신 메시지를 빠르게 확인할 수 있습니다.
      // unreadMessageCount: 읽지 않은 메시지의 수를 저장합니다. 이를 통해 UI에서 새 메시지 알림을 표시할 수 있습니다.
      // {
      //   id: "unique_message_id",
      //   sender: "doctor" | "patient",
      //   content: "메시지 내용",
      //   timestamp: Firebase.firestore.Timestamp.now(),
      //   read: false
      // }
    };

    try {
      const docRef = await addDoc(collection(db, `users/${userId}/patients`), newPatient);
      console.log("New patient created with ID: ", docRef.id);
      return { ...newPatient, id: docRef.id };
    } catch (e) {
      console.error("Error creating new patient: ", e);
      return null;
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <PatientContext.Provider value={{
        patients,
        selectedPatient,
        setSelectedPatient,
        searchTerm,
        setSearchTerm,
        setPatients,
        user,
        updatePatientInFirestore
      }}>
        <div className="relative flex size-full min-h-screen flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
          <Routes>
            <Route path="/" element={
              <div className="layout-container flex h-full grow flex-col">
                <Header />
                <div className="gap-1 px-6 flex flex-1 justify-center py-5">
                  <Aside />
                  <Main />
                </div>
              </div>
            } />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </PatientContext.Provider>
    </Router>
  );
};

export default App;
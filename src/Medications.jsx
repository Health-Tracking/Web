import React, { useState, useContext } from 'react';
import Header from "./Header";
import Aside from "./Aside";
import { PatientContext } from './App';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './index.css';
const Medications = () => {
    const { selectedPatient } = useContext(PatientContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [memo, setMemo] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // 여기에서 선택된 날짜에 해당하는 메모를 불러올 수 있습니다.
    };

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    const saveMemo = () => {
        // 여기에서 메모를 저장하는 로직을 구현할 수 있습니다.
        console.log('메모 저장:', selectedDate, memo);
    };

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1">
                <Aside />
                <main className="flex-1 p-6">
                    <div className="flex">
                        <div className="w-1/2 pr-4">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                inline
                                className="w-full"
                                calendarClassName="w-full"
                            />
                        </div>
                        <div className="w-1/2 pl-4">
                            <h3 className="text-lg font-semibold mb-2">메모</h3>
                            <textarea
                                className="w-full h-40 p-2 border rounded"
                                value={memo}
                                onChange={handleMemoChange}
                                placeholder="이 날짜에 대한 메모를 입력하세요..."
                            />
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={saveMemo}
                            >
                                메모 저장
                            </button>
                        </div>
                    </div>
                    {/* 여기에 처방내역, 검사기록, 방문내역을 표시하는 컴포넌트를 추가할 수 있습니다 */}
                </main>
            </div>
        </div>
    );
};

export default Medications;
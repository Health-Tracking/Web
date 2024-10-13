import React, { useState, useContext, useEffect } from "react";
import Header from "./Header";
import Aside from "./Aside";
import { PatientContext } from "./App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

const Medications = () => {
  const { selectedPatient } = useContext(PatientContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [memoList, setMemoList] = useState({});
  const [detailedMemo, setDetailedMemo] = useState(null);

  useEffect(() => {
    // 환자 선택 시 해당 환자의 메모 리스트 로드
    if (selectedPatient) {
      setMemoList(selectedPatient.memos || {});
    }
  }, [selectedPatient]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateString = date.toLocaleDateString();
    setMemo(memoList[dateString] || "");
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const saveMemo = () => {
    const dateString = selectedDate.toLocaleDateString();
    setMemoList((prev) => ({
      ...prev,
      [dateString]: memo,
    }));
    console.log("메모 저장:", selectedDate, memo);

    // 선택된 환자의 메모를 업데이트
    selectedPatient.memos = { ...memoList, [dateString]: memo };
  };

  const deleteMemo = (date) => {
    setMemoList((prev) => {
      const newMemoList = { ...prev };
      delete newMemoList[date];
      return newMemoList;
    });
  };

  const toggleDetailedMemo = (memo) => {
    if (detailedMemo === memo) {
      setDetailedMemo(null);
    } else {
      setDetailedMemo(memo);
    }
  };

  const isMemoedDate = (date) => {
    const dateString = date.toLocaleDateString();
    return memoList.hasOwnProperty(dateString);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Aside />
        <main className="flex-1 p-6">
          <div className="mb-4">
            {selectedPatient && (
              <h2 className="text-2xl font-semibold">
                {selectedPatient.name}님의 특이사항
              </h2>
            )}
          </div>
          <div className="rounded-lg shadow-lg flex" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}>
            <div className="w-1/2 p-4 border-r">
              <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  className="w-full medical-calendar"
                  calendarClassName="w-full"
                  dayClassName={(date) =>
                    isMemoedDate(date) ? "bg-gray-200" : undefined
                  }
                />
              </div>
              <div>
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
            <div className="w-1/2 p-4">
              <div className="mt-4 h-72 p-2 overflow-y-auto">
                <h4 className="font-semibold mr-2 mb-2">저장된 메모:</h4>
                {Object.entries(memoList).length === 0 ? (
                  <p>저장된 메모가 없습니다.</p>
                ) : (
                  Object.entries(memoList).map(([date, memo]) => (
                    <div key={date} className="flex justify-between items-center mt-2 border-b border-gray-300 p-1">
                      <div onClick={() => toggleDetailedMemo(memo)} className="cursor-pointer">
                        <span className="font-semibold mr-2">{date}:</span>
                        <span>
                          {memo.length > 30 ? `${memo.slice(0, 30)}...` : memo}
                        </span>
                      </div>
                      <button
                        className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => deleteMemo(date)}
                      >
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>
              {detailedMemo && (
                <div className="mt-4 p-2 border border-gray-300 rounded">
                  <h5 className="font-semibold">상세 메모:</h5>
                  <p>{detailedMemo}</p>
                  <button
                    className="mt-2 px-2 py-1 bg-gray-300 rounded"
                    onClick={() => setDetailedMemo(null)}
                  >
                    닫기
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Medications;

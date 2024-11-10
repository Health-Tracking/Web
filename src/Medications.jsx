import React, { useState, useContext, useEffect } from "react";
import { PatientContext } from "./App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const Medications = () => {
  const { selectedPatient } = useContext(PatientContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [memoList, setMemoList] = useState({});
  const [detailedMemo, setDetailedMemo] = useState(null);

  // Firestore에서 메모 데이터 불러오기
  useEffect(() => {
    const fetchMemos = async () => {
      if (selectedPatient?.id) {
        const patientRef = doc(db, 'patients', selectedPatient.id);
        const patientDoc = await getDoc(patientRef);
        if (patientDoc.exists()) {
          const data = patientDoc.data();
          setMemoList(data.memos || {});
        }
      }
    };
    fetchMemos();
  }, [selectedPatient]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateString = date.toLocaleDateString();
    setMemo(memoList[dateString] || "");
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const saveMemo = async () => {
    if (!selectedPatient?.id) return;

    const dateString = selectedDate.toLocaleDateString();
    const updatedMemoList = {
      ...memoList,
      [dateString]: memo,
    };

    try {
      // Firestore 업데이트
      const patientRef = doc(db, 'patients', selectedPatient.id);
      await updateDoc(patientRef, {
        memos: updatedMemoList
      });

      setMemoList(updatedMemoList);
      console.log("메모가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("메모 저장 중 오류 발생:", error);
    }
  };

  const deleteMemo = async (date) => {
    if (!selectedPatient?.id) return;

    const newMemoList = { ...memoList };
    delete newMemoList[date];

    try {
      // Firestore 업데이트
      const patientRef = doc(db, 'patients', selectedPatient.id);
      await updateDoc(patientRef, {
        memos: newMemoList
      });

      setMemoList(newMemoList);
      console.log("메모가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("메모 삭제 중 오류 발생:", error);
    }
  };

  // 선택된 날짜의 메모만 필터링
  const selectedDateMemo = memoList[selectedDate.toLocaleDateString()];

  // isMemoedDate 함수 추가
  const isMemoedDate = (date) => {
    const dateString = date.toLocaleDateString();
    return memoList[dateString] !== undefined;
  };

  // toggleDetailedMemo 함수 추가
  const toggleDetailedMemo = (memo) => {
    setDetailedMemo(detailedMemo === memo ? null : memo);
  };

  return (
    <div className="p-4 border-r">
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
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

        <div className="w-1/2 pl-2">
          <h4 className="font-semibold mr-2 mb-2">저장된 메모</h4>
          <div className="overflow-y-auto max-h-[300px]">
            {!selectedDateMemo ? (
              <p>선택한 날짜의 메모가 없습니다.</p>
            ) : (
              <div className="flex justify-between items-center mt-2 border-b border-gray-300 p-1">
                <div onClick={() => toggleDetailedMemo(selectedDateMemo)} className="cursor-pointer">
                  <span className="font-semibold mr-2">{selectedDate.toLocaleDateString()}:</span>
                  <span>
                    {selectedDateMemo.length > 30
                      ? `${selectedDateMemo.slice(0, 30)}...`
                      : selectedDateMemo}
                  </span>
                </div>
                <button
                  className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteMemo(selectedDate.toLocaleDateString())}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
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

      {/* 상세 메모 표시 추가 */}
      {detailedMemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">상세 메모</h3>
              <button
                onClick={() => setDetailedMemo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                닫기
              </button>
            </div>
            <p className="whitespace-pre-wrap">{detailedMemo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;

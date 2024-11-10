import React, { useEffect, useState, useContext } from 'react';
import { db } from './firebase';
import { doc, updateDoc, getDoc, arrayUnion, Timestamp, onSnapshot } from 'firebase/firestore';
import { PatientContext } from './App';
import Header from "./Header";
import Aside from "./Aside";

const Messages = () => {
    const { selectedPatient, user } = useContext(PatientContext);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // 메시지 불러오기
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedPatient?.id) {
                const patientRef = doc(db, 'patients', selectedPatient.id);
                const patientDoc = await getDoc(patientRef);

                if (patientDoc.exists()) {
                    const data = patientDoc.data();
                    setMessages(data.messages || []);
                }
            }
        };

        fetchMessages();

        // 실시간 업데이트를 위한 리스너 설정
        if (selectedPatient?.id) {
            const patientRef = doc(db, 'patients', selectedPatient.id);
            const unsubscribe = onSnapshot(patientRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setMessages(data.messages || []);
                }
            });

            return () => unsubscribe();
        }
    }, [selectedPatient]);

    const sendMessage = async () => {
        if (!user?.uid || !selectedPatient?.id || !inputMessage.trim()) return;

        try {
            const patientRef = doc(db, 'patients', selectedPatient.id);

            const newMessage = {
                content: inputMessage.trim(),
                timestamp: Timestamp.now(),
                sender: user.uid,
                read: false
            };

            await updateDoc(patientRef, {
                messages: arrayUnion(newMessage)
            });

            setInputMessage('');
        } catch (error) {
            console.error("메시지 전송 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-80 border-r">
                    <Aside />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">
                            {selectedPatient ? `${selectedPatient.name}님과의 대화` : '환자를 선택해주세요'}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${message.sender === user?.uid
                                        ? 'bg-blue-100 ml-auto max-w-[80%]'
                                        : 'bg-gray-100 mr-auto max-w-[80%]'
                                        }`}
                                >
                                    <p className="text-sm text-gray-600">{message.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {message.timestamp?.toDate().toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 border rounded-l-lg p-2"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
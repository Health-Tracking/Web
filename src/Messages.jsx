import React, { useEffect, useState, useContext } from 'react';
import { db } from './firebase';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { PatientContext } from './App';
import Header from "./Header";
import Aside from "./Aside";

const Messages = () => {
    const { selectedPatient, user } = useContext(PatientContext);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const sendMessage = async () => {
        if (!user || !selectedPatient || !inputMessage.trim()) return;
        const messageRef = collection(db, 'users', user.uid, 'patients', selectedPatient.id, 'messages');
        await addDoc(messageRef, {
            sender: 'doctor',
            content: inputMessage.trim(),
            timestamp: new Date(),
            read: false
        });
        setInputMessage(''); // 메시지 전송 후 입력 필드 초기화
    };

    const updateUnreadCount = (newMessages) => {
        // 읽지 않은 메시지 수를 업데이트하는 로직을 구현
        // 예: selectedPatient의 unreadMessageCount를 업데이트
    };

    useEffect(() => {
        if (selectedPatient && user) {
            const messagesRef = collection(db, 'users', user.uid, 'patients', selectedPatient.id, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(newMessages);
                updateUnreadCount(newMessages);
            });

            return () => unsubscribe();
        }
    }, [selectedPatient, user]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-80 border-r">
                    <Aside />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`p-3 rounded-lg ${message.sender === 'doctor' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                                    <p className="font-semibold">{message.sender === 'doctor' ? 'You' : selectedPatient.name}</p>
                                    <p className="text-sm text-gray-600">{message.content}</p>
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
                                placeholder="Type a message..."
                                className="flex-1 border rounded-l-lg p-2"
                            />
                            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
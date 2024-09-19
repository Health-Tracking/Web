import React, { useContext } from 'react';
import { PatientContext } from './App';

const Header = () => {
    const { selectedPatient } = useContext(PatientContext);

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#F4F4F4] px-10 py-3">
            <div className="flex items-center gap-4 text-[#141414]">
                <div className="size-4">
                    {/* SVG 로고 */}
                </div>
                <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Healthcare Monitoring</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                    <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Home</a>
                    <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Patients</a>
                    <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Medications</a>
                    {selectedPatient && (
                        <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Messages</a>
                    )}
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 bg-[#F4F4F4] text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    {/* 알림 아이콘 */}
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/stability/4da7ba2d-59ca-416b-96cc-9c3ea5851c26.png")' }}></div>
            </div>
        </header>
    );
};

export default Header;
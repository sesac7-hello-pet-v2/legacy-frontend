"use client";

import {useState} from "react";
import Modal, {AlertModal, ConfirmModal} from "@/app/components/Modal";
import ConfirmModalComponent from "@/app/components/ConfirmModal";

export default function ModalTestPage() {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showConfirmModalComponent, setShowConfirmModalComponent] = useState(false);
    const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

    const handleConfirm = () => {
        alert("확인을 클릭했습니다!");
    };

    const handleCancel = () => {
        alert("취소를 클릭했습니다!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">모달 테스트 페이지</h1>

                <div className="space-y-6">
                    {/* 기본 모달 테스트 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">기본 모달 (Modal.tsx)</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">모달 크기 선택:</label>
                                <select
                                    value={modalSize}
                                    onChange={(e) => setModalSize(e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
                                    className="border border-gray-300 rounded px-3 py-1"
                                >
                                    <option value="sm">Small</option>
                                    <option value="md">Medium</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra Large</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                기본 모달 열기 ({modalSize})
                            </button>
                        </div>
                    </div>

                    {/* 확인 모달 테스트 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">확인 모달 (ConfirmModal from Modal.tsx)</h2>
                        <div className="space-x-4">
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                            >
                                확인 모달 열기 (Warning)
                            </button>
                        </div>
                    </div>

                    {/* 알림 모달 테스트 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">알림 모달 (AlertModal from Modal.tsx)</h2>
                        <div className="space-x-4">
                            <button
                                onClick={() => setShowAlertModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                알림 모달 열기 (Error)
                            </button>
                        </div>
                    </div>

                    {/* 별도 확인 모달 테스트 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">확인 모달 (ConfirmModal.tsx)</h2>
                        <button
                            onClick={() => setShowConfirmModalComponent(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            별도 확인 모달 열기
                        </button>
                    </div>

                    {/* 투명도 설명 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">배경 효과 테스트</h2>
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                모든 모달의 배경이 <code className="bg-gray-100 px-1 rounded">bg-black/50</code>로 설정되어 50% 투명도를
                                가집니다.
                            </p>
                            <p className="text-gray-600">
                                추가로 <code className="bg-gray-100 px-1 rounded">backdrop-blur-sm</code> 효과가 적용되어
                                뒤의 콘텐츠가 블러 처리되면서 희미하게 보입니다.
                            </p>
                            <p className="text-sm text-gray-500 mt-3">
                                💡 <code>bg-opacity</code> 방식 대신 <code>/50</code> 방식을 사용하여 투명도를 제어합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달들 */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="기본 모달 테스트"
                size={modalSize}
            >
                <div className="space-y-4">
                    <p>이것은 {modalSize} 크기의 기본 모달입니다.</p>
                    <p>배경이 <code className="bg-gray-100 px-1 rounded text-sm">bg-black/50</code>과 <code
                        className="bg-gray-100 px-1 rounded text-sm">backdrop-blur-sm</code>으로 설정되어 있습니다.</p>
                    <p className="text-sm text-gray-600">뒤의 콘텐츠가 50% 투명도 + 블러 효과로 처리됩니다.</p>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirm}
                title="확인 필요"
                message="정말로 이 작업을 수행하시겠습니까?"
                type="warning"
                confirmText="네, 진행합니다"
                cancelText="취소"
            />

            <AlertModal
                isOpen={showAlertModal}
                onClose={() => setShowAlertModal(false)}
                title="오류 발생"
                message="작업을 처리하는 중 오류가 발생했습니다."
                type="error"
                buttonText="확인"
            />

            {showConfirmModalComponent && (
                <ConfirmModalComponent
                    message="이것은 별도의 ConfirmModal 컴포넌트입니다. 계속 진행하시겠습니까?"
                    onConfirm={() => {
                        handleConfirm();
                        setShowConfirmModalComponent(false);
                    }}
                    onCancel={() => {
                        handleCancel();
                        setShowConfirmModalComponent(false);
                    }}
                />
            )}
        </div>
    );
}

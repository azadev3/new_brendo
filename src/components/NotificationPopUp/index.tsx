'use client';

import { XIcon } from 'lucide-react';

interface PopupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export default function NotificationPop({
    isOpen,
    onClose,
    title,
    description,
}: PopupDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 m-4">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <XIcon className="h-5 w-5 text-gray-500" />
                    <span className="sr-only">Close</span>
                </button>

                {/* Content */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
}

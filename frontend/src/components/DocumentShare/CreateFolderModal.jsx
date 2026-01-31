import React, { useState } from 'react';

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
    const [newFolderName, setNewFolderName] = useState('');

    const handleSubmit = () => {
        if (newFolderName.trim()) {
            onCreate(newFolderName);
            setNewFolderName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex gap-2 max-w-md animate-fade-in">
            <input
                type="text"
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
            />
            <button
                onClick={handleSubmit}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Create
            </button>
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                Cancel
            </button>
        </div>
    );
};

export default CreateFolderModal;

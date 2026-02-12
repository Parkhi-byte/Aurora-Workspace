import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const usePasswordManager = () => {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        category: 'login',
        notes: ''
    });

    const fetchPasswords = useCallback(async () => {
        if (!user || !user.token) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/passwords', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPasswords(data);
            } else {
                toast.error('Failed to fetch passwords');
            }
        } catch (err) {
            toast.error('Network error');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPasswords();
    }, [fetchPasswords]);

    const filteredPasswords = useMemo(() => {
        return passwords.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.url && p.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [passwords, searchTerm]);

    const groupedPasswords = useMemo(() => {
        return filteredPasswords.reduce((acc, pwd) => {
            const cat = pwd.category || 'login';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(pwd);
            return acc;
        }, {});
    }, [filteredPasswords]);

    const handleOpenModal = useCallback((password = null) => {
        if (password) {
            setEditingId(password._id);
            setFormData({
                title: password.title,
                username: password.username,
                password: password.password,
                url: password.url || '',
                category: password.category || 'login',
                notes: password.notes || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                username: '',
                password: '',
                url: '',
                category: 'login',
                notes: ''
            });
        }
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            title: '',
            username: '',
            password: '',
            url: '',
            category: 'login',
            notes: ''
        });
    }, []);

    const handleSubmit = async (data) => {
        if (!user || !user.token) return;

        try {
            let response;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            };

            if (editingId) {
                response = await fetch(`/api/passwords/${editingId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch('/api/passwords', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data)
                });
            }

            const responseData = await response.json();
            if (response.ok) {
                fetchPasswords();
                handleCloseModal();
                toast.success(editingId ? 'Password updated successfully' : 'Password added successfully');
            } else {
                toast.error(responseData.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this password entry?')) return;
        if (!user || !user.token) return;

        try {
            const response = await fetch(`/api/passwords/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.ok) {
                setPasswords(passwords.filter(p => p._id !== id));
                toast.success('Password deleted successfully');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Delete failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
    };

    const handleCopy = useCallback(async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    const togglePasswordVisibility = useCallback((id) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    return {
        // State
        passwords, searchTerm, setSearchTerm, showPassword, copiedId, isModalOpen, editingId, isLoading, formData, setFormData,
        // Computed
        filteredPasswords, groupedPasswords,
        // Actions
        handleOpenModal, handleCloseModal, handleSubmit, handleDelete, handleCopy, togglePasswordVisibility
    };
};

import { Video, MessageCircle, FileText, Lock } from 'lucide-react';

export const APP_FEATURES = [
    {
        title: "Video Conference",
        description: "HD video calls with screen sharing, recording, and virtual backgrounds.",
        icon: Video,
        path: "/video-call",
        color: "text-blue-500",
        iconBg: "from-aurora-500 to-purple-600", // Dashboard uses gradient, Home used color classes. Let's standardize.
        // Dashboard used: iconBg: "from-aurora-500 to-purple-600", stats: "Start Meeting"
        // Home used: color: "text-blue-500", iconBg: "bg-blue-100", stats: "Unlimited Minutes"
        // I should probably support both styles or unify them. 
        // Let's keep the content roughly compatible.
        stats: "Start Meeting",
        landingStats: "Unlimited Minutes",
        gradient: "from-blue-600 to-indigo-600"
    },
    {
        title: "Team Chat",
        description: "Real-time messaging with file sharing, threads, and smart notifications.",
        icon: MessageCircle,
        path: "/chat",
        color: "text-purple-500",
        iconBg: "from-purple-500 to-pink-600",
        stats: "Open Chat",
        landingStats: "Encrypted",
        gradient: "from-purple-600 to-pink-600"
    },
    {
        title: "Documents",
        description: "Secure collaborative file storage and version control.",
        icon: FileText,
        path: "/document-share",
        color: "text-orange-500",
        iconBg: "from-orange-500 to-red-600",
        stats: "View Files",
        landingStats: "Version Control",
        gradient: "from-orange-500 to-red-500"
    },
    {
        title: "Password Manager",
        description: "Enterprise-grade password vault and security management.",
        icon: Lock,
        path: "/password-manager",
        color: "text-green-500",
        iconBg: "from-green-500 to-emerald-600",
        stats: "Manage Keys",
        landingStats: "Bank-grade Security",
        gradient: "from-green-500 to-emerald-600"
    }
];

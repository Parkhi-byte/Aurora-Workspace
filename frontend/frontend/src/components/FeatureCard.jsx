import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, path, color, iconBg, stats, gradient }) => {
  return (
    <Link to={path} className="block group">
      <div className="relative glass-card rounded-2xl p-6 h-full overflow-hidden group">
        {/* Subtle Gradient Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

        {/* Decorative Top Line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className={`w-14 h-14 bg-gradient-to-br ${iconBg || color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200/50 dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon size={28} className="text-white drop-shadow-sm" strokeWidth={2} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
            {title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm flex-grow">
            {description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
              {stats}
            </span>
            <div className="flex items-center text-aurora-600 dark:text-aurora-400 group-hover:translate-x-2 transition-transform duration-300 font-medium text-sm">
              <span className="mr-2">Explore</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
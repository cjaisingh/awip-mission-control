import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav className="backdrop-blur-md bg-white/40 border-b border-white/30 shadow-sm px-6 py-3 rounded-xl mx-4 mt-4 flex items-center">
    <ol className="flex items-center space-x-2 text-sm text-gray-700">
      {items.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          {idx > 0 && (
            <li className="text-gray-400">
              <i className="fas fa-chevron-right text-xs" />
            </li>
          )}
          <li>
            {item.href ? (
              <a href={item.href} className="text-blue-600 hover:text-blue-800 flex items-center">
                {item.icon && <i className={`${item.icon} mr-2`} />}
                {item.label}
              </a>
            ) : (
              <span className="text-gray-500 flex items-center">
                {item.icon && <i className={`${item.icon} mr-2`} />}
                {item.label}
              </span>
            )}
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb; 
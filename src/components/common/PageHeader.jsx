import React from "react";

export default function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbs = [],
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-surface-border">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-textSecondary mb-2 font-medium">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-cyanAccent transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-primary font-bold">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-black text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-textSecondary mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

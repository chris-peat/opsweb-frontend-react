import type { url } from 'inspector';
import { useState } from 'react';
import { NavLink } from 'react-router';

const crumbs = [
    {
        text: "Home",
        url: "/"
    },
     {
        text: "Settings",
        url: "/settings"
    }
];

export default function Breadcrumbs() {
  return (
<nav className="flex">
  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
    {crumbs.map((crumb) => (
    <li>
      <div className="flex items-center space-x-1.5">
        <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
        <NavLink to={crumb.url} className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
          {crumb.text}
        </NavLink>
      </div>
    </li>

    ))}
  </ol>
</nav>
  );
}

import type { url } from 'inspector';
import { Link, NavLink, useLocation, useMatches } from 'react-router';

export interface IBreadcrumb {
  text: string;
  path: string;
}

function renderBreadcrumb(crumb: IBreadcrumb) {
  return (crumb.path === "" ?
    <span className="inline-flex items-center">{crumb.text}</span> :
    <Link to={crumb.path} className="inline-flex items-center hover:text-fg-brand hover:underline" >
      {crumb.text}
    </Link>
  )
}

export default function Breadcrumbs() {
  const matches = useMatches();
  const location = useLocation();

  const crumbs: IBreadcrumb[] = [];

  matches
    .filter(
      (match) =>
        match.handle && (match.handle as any).breadcrumbs,
    )
    .forEach((match) => {
      let breadcrumbs = (match.handle as any).breadcrumbs as IBreadcrumb[];
      for (let breadcrumb of breadcrumbs) {
        let crumb = {text: breadcrumb.text, path: breadcrumb.path};
        for (let param of Object.keys(match.params)) {
          crumb.path = crumb.path.replace(`:${param}`, match.params[param] as string)
        }

        if (match.params["projectId"])
          crumb.path = crumb.path.replace("{project}", match.params["projectId"].replace(":", ""));

        if (crumb.path === location.pathname)
          crumb.path = "";

        crumbs.push(crumb);
      }
    });

  return (
    <nav className="flex">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse text-base">
        {crumbs.map((crumb: IBreadcrumb, index) => (
          <li key={index}>
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
              {renderBreadcrumb(crumb)}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { NavLink } from "react-router";
import type { INavMenuGroup } from "~/models/navMenuGroup";
import { useContext } from "react";
import { ProjectContext } from "./layout";

export default function MainMenu({ menuGroups }: { menuGroups: INavMenuGroup[] }) {
  const { project, user } = useContext(ProjectContext);

  return (
    <div>
      <div className="text-2xl">Project {project} Home Page</div>
      Logged in as {user}
      <div className="flex flex-col gap-1 mt-4">
        <div>
          <NavLink to="time-converter">Time converter</NavLink>
        </div>
        <div>
          <NavLink to="scheduled-passes">Scheduled passes</NavLink>
        </div>
      </div>
      {/* {menuGroups.map((group) => (
        <div key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                <NavLink to={item.url}>{item.text}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))} */}
    </div>
  );
}


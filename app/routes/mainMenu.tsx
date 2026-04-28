import { NavLink } from "react-router";
import type { INavMenuGroup } from "~/models/navMenuGroup";

export default function MainMenu({ menuGroups }: { menuGroups: INavMenuGroup[] }) {
  return (
    <div>
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


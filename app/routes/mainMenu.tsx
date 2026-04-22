import { NavLink } from "react-router";

export default function MainMenu() {
  return (
    <div>
      <NavLink to="settings">Go to settings</NavLink><p/>
      <NavLink to="users">Go to users</NavLink><p />
      <NavLink to="scheduled-passes">Go to scheduled passes</NavLink>
    </div>
  );
}


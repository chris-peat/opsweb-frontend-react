import { NavLink } from "react-router";

export default function MainMenu() {
  return (
    <div>
      <NavLink to="settings">Go to settings</NavLink><p/>
      <NavLink to="users">Go to users</NavLink>
    </div>
  );
}


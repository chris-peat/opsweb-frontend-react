import type { INavMenuGroup } from "~/models/navMenuGroup";
import NavDropDownLevel2 from "./navDropDownLevel2";

export default function SidebarNavMenu({ navGroups }: { navGroups: INavMenuGroup[] }) {
    return (
        <aside id="default-sidebar"
            className="fixed top-24 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto border-e border-default">
                <ul className="space-y-2 font-medium">
                    {navGroups.map((group) => (
                        <li>
                            <NavDropDownLevel2 navGroup={group}></NavDropDownLevel2>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
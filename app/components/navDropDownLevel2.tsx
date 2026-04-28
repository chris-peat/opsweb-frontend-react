import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, Bars3Icon } from '@heroicons/react/20/solid'
import { NavLink } from 'react-router';
import type { INavMenuGroup } from '~/models/navMenuGroup';
import type { INavMenuItem } from '~/models/navMenuItem';

export default function NavDropDownLevel2({ navGroup }: { navGroup: INavMenuGroup }) {
    return (
        <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 ">
                {navGroup.title}
            </MenuButton>
            <MenuItems anchor="bottom" className="z-10 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {navGroup.items.map((item: INavMenuItem) => (
                    <MenuItem>
                        <NavLink className="block data-focus:bg-blue-100" to={item.url} >
                            {item.text}
                        </NavLink>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>

    )
}

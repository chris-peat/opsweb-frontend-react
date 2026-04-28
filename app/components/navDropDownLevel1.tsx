import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, Bars3Icon } from '@heroicons/react/20/solid'
import type { INavMenuGroup } from '~/models/navMenuGroup';
import NavDropDownLevel2 from './navDropDownLevel2';

export default function NavDropDownLevel1({ navGroups }: { navGroups: INavMenuGroup[] }) {
    return (
        <div>
            <ul className="flex gap-4">
                {navGroups.map((group) => (
                    <li>
                        <div className='z-12 relative bg-red-500'>
                            <NavDropDownLevel2 navGroup={group} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

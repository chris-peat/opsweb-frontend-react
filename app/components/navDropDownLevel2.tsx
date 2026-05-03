import { Button } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { NavLink } from 'react-router';
import type { INavMenuGroup } from '~/models/navMenuGroup';
import type { INavMenuItem } from '~/models/navMenuItem';

export default function NavDropDownLevel2({ navGroup }: { navGroup: INavMenuGroup }) {
    const [collapsed, setCollapsed] = useState<boolean>(true);

    function onClick() {
        console.log("clicked");
        setCollapsed(!collapsed);
    }

    function modifyUrl(url: string) {
        if (url.includes(".aspx") && !url.startsWith("http")) {
            return url = "https://opsweb.gsoc.dlr.de/" + url;
        }
        return url;
    }

    return (
        <div className="flex gap-1 flex-col">
            <Button type="button" onClick={onClick} className="flex items-center w-full justify-between px-2 py-1.5 rounded-base hover:bg-neutral-200 hover:bg-neutral-tertiary hover:text-fg-brand group">
                {navGroup.title} <ChevronDownIcon className="size-5 self-center justify-self-end sm:size-4" />
            </Button>
            <ul className={collapsed ? " hidden" : ""}>
                {navGroup.items.map((item: INavMenuItem) => (
                    <li className="">
                        <NavLink className="pl-10 flex items-center px-2 py-1 hover:bg-neutral-200 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group" 
                            to={modifyUrl(item.url)} >
                            {item.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>

    )
}

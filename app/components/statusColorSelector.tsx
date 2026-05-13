import { Select } from '@headlessui/react'
import { ChevronDownIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';

export default function StatusColorSelector({ name, value }: { name?: string, value?: string }) {
    const [color, setColor] = useState(value);

    function handleChange(event: any) {
        setColor(event.target.value);
    }
    
    return (
        <Select className={`block w-full appearance-none border-none bg-${color}-300 px-3 text-sm/6 data-hover:cursor-pointer`} onChange={handleChange}>
            <option value="green" className='bg-green-500'>green</option>
            <option value="yellow" className='bg-yellow-500'>yellow</option>
            <option value="red"  className='bg-red-500'>red</option>
        </Select >
    )
}

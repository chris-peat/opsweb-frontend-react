import { Select } from '@headlessui/react'
import { useState } from 'react';

const colorClasses: Record<string, string> = {
    '': 'bg-white',
    green: 'bg-green-300',
    yellow: 'bg-yellow-300',
    red: 'bg-red-300',
};

export default function StatusColorSelector({ name, value, required }: { name?: string, value?: string, required?: boolean }) {
    const [color, setColor] = useState(value ?? '');

    function handleChange(event: any) {
        event.target.setCustomValidity('');
        setColor(event.target.value);
    }

    return (
        <Select
            name={name}
            value={color}
            required={required}
            className={`block w-40 appearance-none border-none ${colorClasses[color] ?? ''} px-1 text-sm/6 text-transparent data-hover:cursor-pointer`}
            onChange={handleChange}
            onInvalid={(e: any) => e.target.setCustomValidity('Please select status')}
        >
            <option value="" className='bg-white'>Select status...</option>
            <option value="green" className='bg-green-300 hover:bg-green-100'></option>
            <option value="yellow" className='bg-yellow-300'></option>
            <option value="red" className='bg-red-300'></option>
        </Select>
    )
}

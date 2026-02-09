'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const periods = [
    { label: 'This Month', value: 'this_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'This Year', value: 'this_year' },
    { label: 'All Time', value: 'all' },
]

export function PeriodFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPeriod = searchParams.get('period') || 'this_month'

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        const params = new URLSearchParams(searchParams.toString())
        params.set('period', value)
        router.push(`?${params.toString()}`)
    }

    return (
        <select
            value={currentPeriod}
            onChange={handlePeriodChange}
            className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
            {periods.map((p) => (
                <option key={p.value} value={p.value}>
                    {p.label}
                </option>
            ))}
        </select>
    )
}

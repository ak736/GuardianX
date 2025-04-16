'use client'

import React, { useState } from 'react'

interface AlertFiltersProps {
  onFilterChange: (filters: {
    status: string
    type: string
    timeRange: string
  }) => void
}

const AlertFilters: React.FC<AlertFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  const handleFilterChange = (field: string, value: string) => {
    let newStatus = status
    let newType = type
    let newTimeRange = timeRange

    switch (field) {
      case 'status':
        newStatus = value
        setStatus(value)
        break
      case 'type':
        newType = value
        setType(value)
        break
      case 'timeRange':
        newTimeRange = value
        setTimeRange(value)
        break
    }

    onFilterChange({
      status: newStatus,
      type: newType,
      timeRange: newTimeRange,
    })
  }

  return (
    <div className='bg-white p-4 shadow sm:rounded-lg mb-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4'>
        <div>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Status
          </label>
          <select
            id='status'
            name='status'
            className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            value={status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value='all'>All Statuses</option>
            <option value='new'>New</option>
            <option value='acknowledged'>Acknowledged</option>
            <option value='resolved'>Resolved</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='type'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Infrastructure Type
          </label>
          <select
            id='type'
            name='type'
            className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            value={type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value='all'>All Types</option>
            <option value='power'>Power Grid</option>
            <option value='water'>Water Infrastructure</option>
            <option value='telecom'>Telecommunications</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='timeRange'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Time Range
          </label>
          <select
            id='timeRange'
            name='timeRange'
            className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            value={timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            <option value='6h'>Last 6 hours</option>
            <option value='24h'>Last 24 hours</option>
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AlertFilters

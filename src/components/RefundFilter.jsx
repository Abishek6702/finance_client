import React from 'react'
import CustomSelect from './CustomSelect'

const yearOptions = [
  'All Years',
  '2025-2026',
  '2024-2025'
]

const departmentOptions = [
  'All Departments',
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'MECH',
  'ME'
]

const modeOptions = [
  'All Modes',
  'Cash',
  'Bank',
  'Wallet'
]

export default function RefundFilter({ filters, onFilterChange }) {

  const handleChange = (key, value) => {
    // convert "All ..." back to empty string for filtering
    if (value?.toLowerCase().includes('all')) {
      value = ''
    }

    // normalize mode values (important for your filter logic)
    if (key === 'mode') {
      if (value === 'Bank') value = 'bank'
      else if (value === 'Cash') value = 'cash'
      else if (value === 'Wallet') value = 'wallet'
    }

    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 0',
      flexWrap: 'wrap',
    }}>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Roll Number"
        value={filters.search || ''}
        onChange={e => handleChange('search', e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          width: '220px'
        }}
      />

      {/* Year */}
      <CustomSelect
        placeholder="Select Year"
        value={filters.year || ''}
        onChange={(val) => handleChange('year', val)}
        options={yearOptions}
      />

      {/* Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.department || ''}
        onChange={(val) => handleChange('department', val)}
        options={departmentOptions}
      />

      {/* Mode */}
      <CustomSelect
        placeholder="Mode"
        value={
          filters.mode === 'bank' ? 'Bank' :
          filters.mode === 'cash' ? 'Cash' :
          filters.mode === 'wallet' ? 'Wallet' : ''
        }
        onChange={(val) => handleChange('mode', val)}
        options={modeOptions}
      />

      {/* Date */}
      <input
        type="date"
        value={filters.date || ''}
        onChange={e => handleChange('date', e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      />
    </div>
  )
}
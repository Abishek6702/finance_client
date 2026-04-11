import React, { useEffect, useState, useMemo } from 'react'
import RefundFilter from './RefundFilter'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getRefundMode(reason) {
  if (!reason) return 'Unknown'
  const lower = reason.toLowerCase()
  if (lower.includes('bank')) return 'Online Payment'
  if (lower.includes('cash')) return 'Cash'
  if (lower.includes('wallet')) return 'Wallet'
  return reason
}

function getYearLabel(rollNo) {
  if (!rollNo) return '-'
  const prefix = rollNo.slice(0, 2)
  const yr = parseInt(prefix, 10)
  if (isNaN(yr)) return '-'
  const currentYear = 26
  const diff = currentYear - yr
  const yearMap = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }
  return yearMap[diff] || `${diff}th Year`
}

function getDeptFromRollNo(rollNo) {
  if (!rollNo) return '-'
  const match = rollNo.match(/\d{2}([A-Z]+)\d+/)
  return match ? match[1] : '-'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function RefundDetailModal({ refund, onClose }) {
  const mode = getRefundMode(refund.reason)
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '16px', width: '320px',
          padding: '24px', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: '#f3f4f6', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: '#6b7280',
          }}
        >✕</button>

        <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '600', color: '#111827' }}>
          Refund Details
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: '#e0e7ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#4f46e5',
          }}>
            {refund.rollNo?.[0] || 'S'}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827' }}>
              {refund.rollNo}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {getYearLabel(refund.rollNo)} / {getDeptFromRollNo(refund.rollNo)}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          {[
            ['Receipt Number', refund.refundReceiptNo],
            ['Roll Number', refund.rollNo],
            ['Sem Period', refund.semesterNumber ?? 'N/A'],
            ['Fees Head', refund.feeHead?.charAt(0).toUpperCase() + refund.feeHead?.slice(1)],
            ['Amount', `₹${refund.refundAmount?.toLocaleString('en-IN')}`],
            ['Raised On', formatDate(refund.createdAt)],
            ['Approved On', formatDate(refund.updatedAt)],
            ['Payment Mode', mode],
            ['Bank Name', refund.studentBankName ?? 'N/A'],
            ['Account No', refund.studentAccount ?? 'N/A'],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', padding: '7px 0',
              borderBottom: '1px solid #f9fafb',
            }}>
              <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{label}</span>
              <span style={{
                fontSize: '13px', color: '#111827', fontWeight: '500',
                textAlign: 'right', marginLeft: '12px',
                wordBreak: 'break-all',
              }}>{value || '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function StudentRefund() {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [filters, setFilters] = useState({ search: '', year: '', department: '', mode: '', date: '' })
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    fetchRefunds()
  }, [page])

  const fetchRefunds = async () => {
    setLoading(true)
    setError(null)

    try {
        const token = localStorage.getItem("token") // 👈 get token

        const res = await fetch(`${BASE_URL}/api/refund/report?page=${page}&limit=20`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // 👈 IMPORTANT
        }
        })

        const json = await res.json()
        console.log("API RESPONSE:", json)

        if (json?.data?.refunds) {
        setRefunds(json.data.refunds)
        setPagination(json.data.pagination || { total: 0, totalPages: 1 })
        } else {
        setError(json?.message || 'Failed to fetch refunds.')
        }

    } catch (err) {
        console.error(err)
        setError('Network error. Please try again.')
    } finally {
        setLoading(false)
    }
    }

    const handleClearFilters = () => {
      setFilters({
        search: '',
        year: '',
        department: '',
        mode: '',
        date: ''
      })
    }

  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      const search = filters.search.toLowerCase()

      const matchSearch =
        !search || r.rollNo?.toLowerCase().includes(search)

      const matchYear =
        !filters.year || r.academicYear === filters.year

      const dept = getDeptFromRollNo(r.rollNo)
      const matchDept =
        !filters.department || dept === filters.department

      const mode = getRefundMode(r.reason).toLowerCase()
      const matchMode =
        !filters.mode ||
        (filters.mode === 'cash' && mode === 'cash') ||
        (filters.mode === 'bank' && mode === 'online payment') ||
        (filters.mode === 'wallet' && mode === 'wallet')

      const itemDate = new Date(r.createdAt).toISOString().slice(0, 10)
      const matchDate =
        !filters.date || itemDate === filters.date

      return (
        matchSearch &&
        matchYear &&
        matchDept &&
        matchMode &&
        matchDate
      )
    })
  }, [refunds, filters])

  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: '13px',
    fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap', background: '#f9fafb',
  }

  const tdStyle = {
    padding: '14px 16px', fontSize: '13px', color: '#374151',
    borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle',
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <RefundFilter filters={filters} onFilterChange={setFilters} onClearFilters={handleClearFilters}/>

      <div style={{
        border: '1px solid #e5e7eb', borderRadius: '12px',
        overflow: 'hidden', background: '#fff',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Student Details</th>
                <th style={thStyle}>Roll Number</th>
                <th style={thStyle}>Year / Department</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Refunded On</th>
                <th style={thStyle}>Refund Mode</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    Loading refunds...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No refunds found.
                  </td>
                </tr>
              )}
              {!loading && !error && filteredRefunds.map((refund) => {
                const year = getYearLabel(refund.rollNo)
                const dept = getDeptFromRollNo(refund.rollNo)
                const mode = getRefundMode(refund.reason)
                const feesHead = refund.feeHead?.charAt(0).toUpperCase() + refund.feeHead?.slice(1)

                return (
                  <tr key={refund._id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: '#e0e7ff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '13px', fontWeight: '600',
                          color: '#4f46e5', flexShrink: 0,
                        }}>
                          {refund.rollNo?.[2] || 'S'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '500', fontSize: '13px', color: '#111827' }}>
                            {refund.rollNo}
                          </p>
                          <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>{feesHead}</p>
                        </div>
                      </div>
                    </td>

                    <td style={{ ...tdStyle, fontWeight: '500', color: '#111827' }}>
                      {refund.rollNo}
                    </td>

                    <td style={tdStyle}>
                      <span style={{
                        background: '#f0f9ff', color: '#0369a1', fontSize: '12px',
                        padding: '3px 8px', borderRadius: '20px', fontWeight: '500',
                        whiteSpace: 'nowrap',
                      }}>
                        {year} / {dept}
                      </span>
                    </td>

                    <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>
                      ₹{refund.refundAmount?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ ...tdStyle, color: '#6b7280' }}>
                      {formatDate(refund.createdAt)}
                    </td>

                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                        background: mode === 'Cash' ? '#f0fdf4' : '#f0f9ff',
                        color: mode === 'Cash' ? '#15803d' : '#0369a1',
                      }}>
                        {mode === 'Cash' ? '💵' : '🏦'} {mode}
                      </span>
                    </td>

                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        style={{
                          width: '34px', height: '34px', borderRadius: '50%',
                          background: '#1d4ed8', border: 'none', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                        onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
                        title="View details"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!loading && pagination.totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: '1px solid #f3f4f6',
          }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db',
                  background: page === 1 ? '#f9fafb' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px', color: page === 1 ? '#9ca3af' : '#374151',
                }}
              >Previous</button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                style={{
                  padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db',
                  background: page === pagination.totalPages ? '#f9fafb' : '#fff',
                  cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '13px', color: page === pagination.totalPages ? '#9ca3af' : '#374151',
                }}
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {selectedRefund && (
        <RefundDetailModal refund={selectedRefund} onClose={() => setSelectedRefund(null)} />
      )}
    </div>
  )
}
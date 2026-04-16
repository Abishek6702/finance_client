import React, { useEffect, useState, useMemo,useRef  } from 'react'
import RefundFilter from './RefundFilter'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const YEAR_MAP = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

function getRefundMode(reason) {
  if (!reason) return 'Unknown'
  const lower = reason.toLowerCase()
  if (lower.includes('bank')) return 'Online Payment'
  if (lower.includes('cash')) return 'Cash'
  if (lower.includes('wallet')) return 'Wallet'
  return reason
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

function Avatar({ src, name, size = 36 }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgFailed(true)}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0, border: '1px solid #e5e7eb',
        }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#e0e7ff', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size === 44 ? '16px' : '13px',
      fontWeight: '600', color: '#4f46e5', flexShrink: 0,
    }}>
      {name?.[0]?.toUpperCase() || 'S'}
    </div>
  )
}

function RefundDetailModal({ refund, onClose }) {
  const mode = getRefundMode(refund.reason)
  const year = YEAR_MAP[refund.yearOfStudying] || `${refund.yearOfStudying}th Year`

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
          <Avatar src={refund.profileUrl} name={refund.name} size={44} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827' }}>
              {refund.name || refund.rollNo}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {year} / {refund.department}
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
                textAlign: 'right', marginLeft: '12px', wordBreak: 'break-all',
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
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const tableRef = useRef(null)

  useEffect(() => {
    fetchRefunds(1)
  }, [])

  useEffect(() => {
    const container = tableRef.current
    if (!container) return

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
      ) {
        if (!loadingMore && hasMore) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchRefunds(nextPage)
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [page, loadingMore, hasMore])

  const fetchRefunds = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        `${BASE_URL}/api/refund?page=${pageNumber}&limit=30`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const json = await res.json()

      if (json?.data?.rows) {
        const normalized = json.data.rows.map(r => ({
          _id: r.receiptNumber,
          name: r.name,
          profileUrl: r.profileUrl,
          rollNo: r.rollNumber,
          refundReceiptNo: r.receiptNumber,
          feeHead: r.feesHead,
          refundAmount: r.amount,
          createdAt: r.raisedOn,
          updatedAt: r.approvedOn,
          reason: r.RefundMode,
          studentBankName: r.bankName,
          studentAccount: r.accountNo,
          semesterNumber: r.semPeriod,
          yearOfStudying: r.yearOfStudying,
          department: r.department,
        }))

        // 🔥 append data instead of replace
        setRefunds(prev =>
          pageNumber === 1 ? normalized : [...prev, ...normalized]
        )

        // 🔥 stop when no more data
        if (normalized.length < 30) {
          setHasMore(false)
        }
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({ search: '', year: '', department: '', mode: '', date: '' })
  }

  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      const search = filters.search.toLowerCase()
      const matchSearch = !search || r.rollNo?.toLowerCase().includes(search)
      const matchYear = !filters.year || r.academicYear === filters.year
      const matchDept = !filters.department || r.department === filters.department
      const mode = getRefundMode(r.reason).toLowerCase()
      const matchMode =
        !filters.mode ||
        (filters.mode === 'cash' && mode === 'cash') ||
        (filters.mode === 'bank' && mode === 'online payment') ||
        (filters.mode === 'wallet' && mode === 'wallet')
      const itemDate = new Date(r.createdAt).toISOString().slice(0, 10)
      const matchDate = !filters.date || itemDate === filters.date
      return matchSearch && matchYear && matchDept && matchMode && matchDate
    })
  }, [refunds, filters])

  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: '13px',
    fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap', background: '#f9fafb',position: 'sticky',top: 0, zIndex: 10
  }

  const tdStyle = {
    padding: '14px 16px', fontSize: '13px', color: '#374151',
    borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle',
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <RefundFilter filters={filters} onFilterChange={setFilters} onClearFilters={handleClearFilters} />

      <div style={{
        border: '1px solid #e5e7eb', borderRadius: '12px',
        overflow: 'hidden', background: '#fff',
      }}>
        <div ref={tableRef} style={{maxHeight: '500px', overflow: 'auto'}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px', }}>
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
            <tbody className='overflow-auto'>
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
                const year = YEAR_MAP[refund.yearOfStudying] || `${refund.yearOfStudying}th Year`
                const mode = getRefundMode(refund.reason)
                const feesHead = refund.feeHead?.charAt(0).toUpperCase() + refund.feeHead?.slice(1)

                return (
                  <tr key={refund._id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar src={refund.profileUrl} name={refund.name} size={36} />
                        <div>
                          <p style={{ margin: 0, fontWeight: '500', fontSize: '13px', color: '#111827' }}>
                            {refund.name || refund.rollNo}
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
                        {year} / {refund.department}
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
                        {mode === 'Cash' ? '' : ''} {mode}
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

        {loadingMore && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            Loading more refunds...
          </div>
        )}
      </div>

      {selectedRefund && (
        <RefundDetailModal refund={selectedRefund} onClose={() => setSelectedRefund(null)} />
      )}
    </div>
  )
}
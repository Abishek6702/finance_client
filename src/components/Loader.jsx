import React from 'react'

const loader = (
    { loading }
) => {
  return (
    <div>
      {loading && <p>Loading...</p>}
    </div>
  )
}

export default loader

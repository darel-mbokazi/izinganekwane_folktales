import React from 'react'

const Footer: React.FC = () => {
  const year: number = new Date().getFullYear()

  return (
    <div className="bg-slate-950 text-slate-300 py-8 flex justify-center items-center mt-10">
      <p>&copy; Izinganekwane - {year}</p>
    </div>
  )
}

export default Footer

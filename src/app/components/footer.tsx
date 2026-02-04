'use client'
export default function Footer() {
  return (
    <footer className="relative z-10 flex justify-between items-center px-8 md:px-16 py-8 text-white/50 font-sans text-xs font-bold bg-linear-to-t from-black via-black-50 to-transparent">
      <p>Cluster 127 &copy; {new Date().getFullYear()}</p>
      <p>Synthetic Biology for Software.</p>
    </footer>
  )
}

import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors ${isActive ? "text-amber-400" : "text-neutral-400 hover:text-neutral-100"
    }`;

  return (
    <header className="border-b border-neutral-800 bg-[#14171c]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="font-display text-[15px] font-medium text-neutral-100">
            Cloudinary Console
          </span>
        </div>
        <nav className="flex gap-6">
          <NavLink to="/" end className={linkClass}>
            Upload
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

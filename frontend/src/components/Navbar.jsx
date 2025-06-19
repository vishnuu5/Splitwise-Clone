import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Splitwise Clone
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/users" className="text-gray-600 hover:text-primary-600 transition-colors">
              Users
            </Link>
            <Link to="/groups" className="text-gray-600 hover:text-primary-600 transition-colors">
              Groups
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

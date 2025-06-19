import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Splitwise Clone</h1>
        <p className="text-xl text-gray-600 mb-8">Track shared expenses and figure out who owes whom</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Manage Users</h3>
          <p className="text-gray-600 mb-4">Create and manage users in the system</p>
          <Link to="/users" className="btn-primary">
            View Users
          </Link>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Create Groups</h3>
          <p className="text-gray-600 mb-4">Create groups and add members to track shared expenses</p>
          <Link to="/groups/create" className="btn-primary">
            Create Group
          </Link>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-3">View Groups</h3>
          <p className="text-gray-600 mb-4">View all groups and manage expenses</p>
          <Link to="/groups" className="btn-primary">
            View Groups
          </Link>
        </div>
      </div>

      <div className="mt-12 card">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Create a Group</h3>
            <p className="text-gray-600">Add friends and family to your group</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Add Expenses</h3>
            <p className="text-gray-600">Record shared expenses and how to split them</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Track Balances</h3>
            <p className="text-gray-600">See who owes whom and settle up</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

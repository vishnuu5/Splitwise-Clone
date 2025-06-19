import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Groups from "./pages/Groups"
import GroupDetail from "./pages/GrouDetail"
import CreateGroup from "./pages/CreateGroup"
import AddExpense from "./pages/AddExpense"
import UserBalances from "./pages/UserBalances"
import Users from "./pages/Users"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/create" element={<CreateGroup />} />
            <Route path="/groups/:id" element={<GroupDetail />} />
            <Route path="/groups/:id/add-expense" element={<AddExpense />} />
            <Route path="/users/:id/balances" element={<UserBalances />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

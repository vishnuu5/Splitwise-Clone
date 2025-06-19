
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"

const UserBalances = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [balances, setBalances] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserBalances()
  }, [id])

  const fetchUserBalances = async () => {
    try {
      const [userRes, balancesRes, usersRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/users/${id}/balances`),
        api.get("/users/"),
      ])

      setUser(userRes.data)
      setBalances(balancesRes.data)

      // Create users lookup
      const usersLookup = {}
      usersRes.data.forEach((user) => {
        usersLookup[user.id] = user
      })
      setUsers(usersLookup)
    } catch (error) {
      console.error("Error fetching user balances:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (!user) {
    return <div className="text-center">User not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{user.name}'s Balances</h1>

      {balances.length > 0 ? (
        <div className="space-y-6">
          {balances.map((groupBalance) => (
            <div key={groupBalance.group_id} className="card">
              <h2 className="text-xl font-semibold mb-4">{groupBalance.group_name}</h2>
              <div className="space-y-3">
                {groupBalance.balances.map((balance, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    {balance.from_user === Number.parseInt(id) ? (
                      <span>You owe {users[balance.to_user]?.name}</span>
                    ) : (
                      <span>{users[balance.from_user]?.name} owes you</span>
                    )}
                    <span
                      className={`font-semibold ${
                        balance.from_user === Number.parseInt(id) ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ${balance.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-gray-500">No balances found. You're all settled up! 🎉</p>
        </div>
      )}
    </div>
  )
}

export default UserBalances

"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../services/api"
import EditExpenseModal from "../components/EditExpenseModal"

const GroupDetail = () => {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    fetchGroupData()
  }, [id])

  const fetchGroupData = async () => {
    try {
      const [groupRes, expensesRes, balancesRes, usersRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/groups/${id}/expenses/`),
        api.get(`/groups/${id}/balances`),
        api.get("/users/"),
      ])

      setGroup(groupRes.data)
      setExpenses(expensesRes.data)
      setBalances(balancesRes.data)

      // Create users lookup
      const usersLookup = {}
      usersRes.data.forEach((user) => {
        usersLookup[user.id] = user
      })
      setUsers(usersLookup)
    } catch (error) {
      console.error("Error fetching group data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditExpense = async (expenseData) => {
    try {
      await api.put(`/expenses/${editingExpense.id}`, expenseData)
      fetchGroupData()
    } catch (error) {
      console.error("Error updating expense:", error)
      throw error
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.delete(`/expenses/${expenseId}`)
        fetchGroupData()
      } catch (error) {
        console.error("Error deleting expense:", error)
        alert("Error deleting expense")
      }
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (!group) {
    return <div className="text-center">Group not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <Link to={`/groups/${id}/add-expense`} className="btn-primary">
          Add Expense
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Balances */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Group Balances</h2>
          {balances.length > 0 ? (
            <div className="space-y-3">
              {balances.map((balance, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>
                    {users[balance.from_user]?.name} owes {users[balance.to_user]?.name}
                  </span>
                  <span className="font-semibold text-red-600">${balance.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">All settled up! 🎉</p>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{expense.description}</h3>
                      <p className="text-sm text-gray-500">Paid by {users[expense.paid_by]?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(expense.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-green-600">${expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No expenses yet. Add your first expense!</p>
          )}
        </div>
      </div>

      {/* All Expenses */}
      {expenses.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">All Expenses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Paid By</th>
                  <th className="text-left py-2">Split Type</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="py-2">{expense.description}</td>
                    <td className="py-2">${expense.amount.toFixed(2)}</td>
                    <td className="py-2">{users[expense.paid_by]?.name}</td>
                    <td className="py-2 capitalize">{expense.split_type}</td>
                    <td className="py-2">{new Date(expense.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingExpense(expense)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditExpenseModal
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={handleEditExpense}
      />
    </div>
  )
}

export default GroupDetail

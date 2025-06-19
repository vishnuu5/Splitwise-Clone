

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../services/api"

const AddExpense = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    paid_by: "",
    split_type: "equal",
    splits: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGroupData()
  }, [id])

  const fetchGroupData = async () => {
    try {
      const [groupRes, usersRes] = await Promise.all([api.get(`/groups/${id}`), api.get("/users/")])

      setGroup(groupRes.data)
      setUsers(usersRes.data)

      // Initialize splits for percentage mode
      const initialSplits = usersRes.data.map((user) => ({
        user_id: user.id,
        percentage: 0,
      }))
      setFormData((prev) => ({ ...prev, splits: initialSplits }))
    } catch (error) {
      console.error("Error fetching group data:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.split_type === "percentage") {
      const totalPercentage = formData.splits.reduce((sum, split) => sum + split.percentage, 0)
      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert("Percentages must add up to 100%")
        return
      }
    }

    setLoading(true)
    try {
      await api.post(`/groups/${id}/expenses/`, {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        paid_by: Number.parseInt(formData.paid_by),
      })
      navigate(`/groups/${id}`)
    } catch (error) {
      console.error("Error creating expense:", error)
      alert("Error creating expense")
    } finally {
      setLoading(false)
    }
  }

  const handleSplitChange = (userId, percentage) => {
    setFormData((prev) => ({
      ...prev,
      splits: prev.splits.map((split) =>
        split.user_id === userId ? { ...split, percentage: Number.parseFloat(percentage) || 0 } : split,
      ),
    }))
  }

  const getTotalPercentage = () => {
    return formData.splits.reduce((sum, split) => sum + split.percentage, 0)
  }

  if (!group) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Expense to {group.name}</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
            <select
              value={formData.paid_by}
              onChange={(e) => setFormData({ ...formData, paid_by: e.target.value })}
              className="select"
              required
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
            <select
              value={formData.split_type}
              onChange={(e) => setFormData({ ...formData, split_type: e.target.value })}
              className="select"
            >
              <option value="equal">Equal Split</option>
              <option value="percentage">Percentage Split</option>
            </select>
          </div>

          {formData.split_type === "percentage" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Split Percentages</label>
              <div className="space-y-2">
                {formData.splits.map((split) => {
                  const user = users.find((u) => u.id === split.user_id)
                  return (
                    <div key={split.user_id} className="flex items-center space-x-3">
                      <span className="w-32 text-sm">{user?.name}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={split.percentage}
                        onChange={(e) => handleSplitChange(split.user_id, e.target.value)}
                        className="input flex-1"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 text-sm">
                Total: {getTotalPercentage().toFixed(2)}%
                {Math.abs(getTotalPercentage() - 100) > 0.01 && (
                  <span className="text-red-500 ml-2">(Must equal 100%)</span>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "Adding..." : "Add Expense"}
            </button>
            <button type="button" onClick={() => navigate(`/groups/${id}`)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense

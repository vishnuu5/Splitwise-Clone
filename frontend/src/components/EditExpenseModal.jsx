"use client"

import { useState, useEffect } from "react"
import { api } from "../services/api"

const EditExpenseModal = ({ expense, isOpen, onClose, onSave }) => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    amount: expense?.amount || "",
    paid_by: expense?.paid_by || "",
    split_type: expense?.split_type || "equal",
    splits: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && expense) {
      fetchUsers()
      setFormData({
        description: expense.description || "",
        amount: expense.amount?.toString() || "",
        paid_by: expense.paid_by?.toString() || "",
        split_type: expense.split_type || "equal",
        splits: expense.splits || [],
      })
    }
  }, [isOpen, expense])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/")
      setUsers(response.data)

      // Initialize splits for percentage mode
      const initialSplits = response.data.map((user) => ({
        user_id: user.id,
        percentage: 0,
      }))
      setFormData((prev) => ({ ...prev, splits: initialSplits }))
    } catch (error) {
      console.error("Error fetching users:", error)
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
      await onSave({
        ...formData,
        amount: Number.parseFloat(formData.amount),
        paid_by: Number.parseInt(formData.paid_by),
      })
      onClose()
    } catch (error) {
      console.error("Error updating expense:", error)
      alert("Error updating expense")
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
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
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.splits.map((split) => {
                  const user = users.find((u) => u.id === split.user_id)
                  return (
                    <div key={split.user_id} className="flex items-center space-x-3">
                      <span className="w-20 text-sm">{user?.name}</span>
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpenseModal

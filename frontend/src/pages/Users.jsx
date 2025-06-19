"use client"

import { useState, useEffect } from "react"
import { api } from "../services/api"
import EditUserModal from "../components/EditUserModal"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/users/", formData)
      setFormData({ name: "", email: "" })
      setShowForm(false)
      fetchUsers()
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleEditClick = (user) => {
    console.log("Edit clicked for user:", user) // Debug log
    setEditingUser(user)
  }

  const handleEdit = async (userData) => {
    try {
      await api.put(`/users/${editingUser.id}`, userData)
      setEditingUser(null) // Close modal
      fetchUsers() // Refresh list
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  const handleCloseEdit = () => {
    setEditingUser(null)
  }

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will also delete all their expenses and group memberships.",
      )
    ) {
      try {
        await api.delete(`/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error deleting user")
      }
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Create User
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">Created: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found. Create your first user!</p>
        </div>
      )}

      {/* Edit Modal */}
      <EditUserModal user={editingUser} isOpen={!!editingUser} onClose={handleCloseEdit} onSave={handleEdit} />
    </div>
  )
}

export default Users

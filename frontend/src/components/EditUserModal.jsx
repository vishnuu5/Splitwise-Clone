
import { useState, useEffect } from "react"

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  // Reset form data whenever the modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      console.log("Setting form data for user:", user) 
      setFormData({
        name: user.name || "",
        email: user.email || "",
      })
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: "",
        email: "",
      })
    }
  }, [isOpen, user]) // More specific dependencies

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error updating user")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="input"
              placeholder={user.name} // Fallback placeholder
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="input"
              placeholder={user.email} // Fallback placeholder
              required
            />
          </div>
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

export default EditUserModal

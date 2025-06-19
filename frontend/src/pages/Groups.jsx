
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../services/api"
import EditGroupModal from "../components/EditGroupModal"

const Groups = () => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingGroup, setEditingGroup] = useState(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups/")
      setGroups(response.data)
    } catch (error) {
      console.error("Error fetching groups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (groupData) => {
    try {
      await api.put(`/groups/${editingGroup.id}`, groupData)
      fetchGroups()
    } catch (error) {
      console.error("Error updating group:", error)
      throw error
    }
  }

  const handleDelete = async (groupId) => {
    if (
      window.confirm("Are you sure you want to delete this group? This will also delete all expenses in this group.")
    ) {
      try {
        await api.delete(`/groups/${groupId}`)
        fetchGroups()
      } catch (error) {
        console.error("Error deleting group:", error)
        alert("Error deleting group")
      }
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Link to="/groups/create" className="btn-primary">
          Create Group
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <Link to={`/groups/${group.id}`} className="text-lg font-semibold hover:text-primary-600">
                  {group.name}
                </Link>
                <p className="text-sm text-gray-500">Created: {new Date(group.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingGroup(group)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(group.id)} className="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No groups found. Create your first group!</p>
          <Link to="/groups/create" className="btn-primary">
            Create Group
          </Link>
        </div>
      )}

      <EditGroupModal
        group={editingGroup}
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        onSave={handleEdit}
      />
    </div>
  )
}

export default Groups

"use client"

import { useState, useEffect } from "react"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([])
  const [reservations, setReservations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("rooms")
  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "standard",
    price: "",
    capacity: "",
    beds: "",
    bathrooms: "",
    description: "",
    image: "/placeholder.svg?height=300&width=400",
  })
  const [editingRoomId, setEditingRoomId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsResponse = await fetch("http://localhost:5000/api/rooms")
        const roomsData = await roomsResponse.json()

        if (!roomsResponse.ok) {
          throw new Error(roomsData.message || "Failed to fetch rooms")
        }

        setRooms(roomsData)

        // Fetch reservations
        const reservationsResponse = await fetch("http://localhost:5000/api/reservations")
        const reservationsData = await reservationsResponse.json()

        if (!reservationsResponse.ok) {
          throw new Error(reservationsData.message || "Failed to fetch reservations")
        }

        setReservations(reservationsData)

        // Fetch users
        const usersResponse = await fetch("http://localhost:5000/api/users")
        const usersData = await usersResponse.json()

        if (!usersResponse.ok) {
          throw new Error(usersData.message || "Failed to fetch users")
        }

        setUsers(usersData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target
    setRoomForm({ ...roomForm, [name]: value })
  }

  

  const handleRoomSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingRoomId ? `http://localhost:5000/api/rooms/${editingRoomId}` : "http://localhost:5000/api/rooms"

      const method = editingRoomId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...roomForm,
          price: Number.parseFloat(roomForm.price),
          capacity: Number.parseInt(roomForm.capacity),
          beds: Number.parseInt(roomForm.beds),
          bathrooms: Number.parseInt(roomForm.bathrooms),
          available: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save room")
      }

      // Update rooms list
      if (editingRoomId) {
        setRooms(rooms.map((room) => (room.id === editingRoomId ? data : room)))
      } else {
        setRooms([...rooms, data])
      }

      // Reset form
      setRoomForm({
        name: "",
        type: "standard",
        price: "",
        capacity: "",
        beds: "",
        bathrooms: "",
        description: "",
        image: "/placeholder.svg?height=300&width=400",
      })
      setEditingRoomId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditRoom = (room) => {
    setRoomForm({
      name: room.name,
      type: room.type,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      beds: room.beds.toString(),
      bathrooms: room.bathrooms.toString(),
      description: room.description,
      image: room.image,
    })
    setEditingRoomId(room.id)
    setActiveTab("addRoom")
  }

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete room")
      }

      // Update rooms list
      setRooms(rooms.filter((room) => room.id !== roomId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleRoomAvailability = async (roomId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: !currentStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update room availability")
      }

      // Update rooms list
      setRooms(rooms.map((room) => (room.id === roomId ? { ...room, available: !currentStatus } : room)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === "rooms" ? "active" : ""}`} onClick={() => setActiveTab("rooms")}>
            Rooms
          </button>
          <button
            className={`tab-btn ${activeTab === "reservations" ? "active" : ""}`}
            onClick={() => setActiveTab("reservations")}
          >
            Reservations
          </button>
          <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === "addRoom" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("addRoom")
              setEditingRoomId(null)
              setRoomForm({
                name: "",
                type: "standard",
                price: "",
                capacity: "",
                beds: "",
                bathrooms: "",
                description: "",
                image: "/placeholder.svg?height=300&width=400",
              })
            }}
          >
            {editingRoomId ? "Edit Room" : "Add Room"}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "rooms" && (
            <div className="rooms-tab">
              <h2>Room Management</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td>{room.id}</td>
                        <td>{room.name}</td>
                        <td>{room.type}</td>
                        <td>${room.price}</td>
                        <td>{room.capacity} guests</td>
                        <td>
                          <span className={`status-badge ${room.available ? "available" : "reserved"}`}>
                            {room.available ? "Available" : "Reserved"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="btn-action btn-edit" onClick={() => handleEditRoom(room)}>
                            Edit
                          </button>
                          <button
                            className="btn-action btn-toggle"
                            onClick={() => handleToggleRoomAvailability(room.id, room.available)}
                          >
                            {room.available ? "Mark Reserved" : "Mark Available"}
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDeleteRoom(room.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="reservations-tab">
              <h2>Reservation Management</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Room</th>
                      <th>Guest</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Guests</th>
                      <th>Payment</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => {
                      const room = rooms.find((r) => r.id === reservation.roomId)
                      const user = users.find((u) => u.id === reservation.userId)
                      return (
                        <tr key={reservation.id}>
                          <td>{reservation.id}</td>
                          <td>{room ? room.name : "Unknown"}</td>
                          <td>{user ? user.name : "Unknown"}</td>
                          <td>{new Date(reservation.checkIn).toLocaleDateString()}</td>
                          <td>{new Date(reservation.checkOut).toLocaleDateString()}</td>
                          <td>{reservation.guests}</td>
                          <td>{reservation.paymentMethod === "onsite" ? "Pay at Hotel" : "Online"}</td>
                          <td>${reservation.totalPrice}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-tab">
              <h2>User Management</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.isAdmin ? "admin" : "user"}`}>
                            {user.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "addRoom" && (
            <div className="add-room-tab">
              <h2>{editingRoomId ? "Edit Room" : "Add New Room"}</h2>
              <form onSubmit={handleRoomSubmit} className="room-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Room Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={roomForm.name}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="type">Room Type</label>
                    <select
                      id="type"
                      name="type"
                      value={roomForm.type}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      required
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="family">Family</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price per Night ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={roomForm.price}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="capacity">Max Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={roomForm.capacity}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="beds">Number of Beds</label>
                    <input
                      type="number"
                      id="beds"
                      name="beds"
                      value={roomForm.beds}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bathrooms">Number of Bathrooms</label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={roomForm.bathrooms}
                      onChange={handleRoomFormChange}
                      className="form-control"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={roomForm.description}
                    onChange={handleRoomFormChange}
                    className="form-control"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={roomForm.image}
                    onChange={handleRoomFormChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-save">
                    {editingRoomId ? "Update Room" : "Add Room"}
                  </button>
                  {editingRoomId && (
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={() => {
                        setEditingRoomId(null)
                        setRoomForm({
                          name: "",
                          type: "standard",
                          price: "",
                          capacity: "",
                          beds: "",
                          bathrooms: "",
                          description: "",
                          image: "/placeholder.svg?height=300&width=400",
                        })
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

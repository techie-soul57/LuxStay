"use client"

import { useState, useEffect } from "react"
import RoomCard from "../components/RoomCard"
import "./Rooms.css"

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    capacity: "",
  })

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch rooms")
        }

        setRooms(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const filteredRooms = rooms.filter((room) => {
    if (filters.type !== "all" && room.type !== filters.type) return false;
    if (filters.minPrice && room.price < Number.parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && room.price > Number.parseInt(filters.maxPrice)) return false;
    if (filters.capacity && room.capacity < Number.parseInt(filters.capacity)) return false;
    return true;
  })

  if (loading) {
    return <div className="loading">Loading rooms...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Our Rooms</h1>
        <p>Choose from our selection of premium rooms and suites</p>
      </div>

      <div className="container">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="type">Room Type</label>
            <select id="type" name="type" value={filters.type} onChange={handleFilterChange} className="form-control">
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="family">Family</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="form-control"
              placeholder="Min $"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="form-control"
              placeholder="Max $"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="capacity">Guests</label>
            <select
              id="capacity"
              name="capacity"
              value={filters.capacity}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="no-rooms">
            <h3>No rooms match your search criteria</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Rooms

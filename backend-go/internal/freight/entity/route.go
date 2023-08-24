package entity

import "time"

type Route struct {
	ID string
	Name string
	Distance float64
	Status string
	FreightPrice float64
	StartedAt time.Time
	FinishedAt time.Time
}

func NewRoute(id, name string, distance float64) *Route {
	return &Route{
		ID: id,
		Name: name,
		Distance: distance,
		Status: "pending",
	}
}

func (r *Route) Start(startedAt time.Time) {
	r.Status = "started"
	r.StartedAt = startedAt
}

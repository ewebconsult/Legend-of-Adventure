package entities

import (
	"fmt"
	"log"

	"legend-of-adventure/server/events"
)


type InventoryOwner interface {
	UpdateInventory()
}


type Inventory struct {
	Owner    InventoryOwner
	inv      []string
	capacity int
}

func NewInventory(owner InventoryOwner, capacity int) *Inventory {
	slots := make([]string, capacity)
	return &Inventory{owner, slots, capacity}
}

func (self *Inventory) Get(index int) string {
	return self.inv[index]
}

func (self *Inventory) Capacity() int {
	return self.capacity
}

func (self *Inventory) NumItems() int {
	count := 0
	for _, v := range self.inv {
		if v != "" {
			count = count + 1
		}
	}
	return count
}

func (self *Inventory) IsFull() bool {
	for _, v := range self.inv {
		if v == "" {
			return false
		}
	}
	return true
}

func (self *Inventory) Give(item string) (bool, int) { // Success, Slot
	if self.IsFull() {
		return false, 0
	}

	for i, v := range self.inv {
		if v == "" {
			self.inv[i] = item
			self.Owner.UpdateInventory()
			return true, i
		}
	}
	return false, 0
}

func (self *Inventory) Clear() {
	for i := 0; i < self.capacity; i++ {
		self.ClearSlot(i)
	}
}

func (self *Inventory) ClearSlot(index int) {
	self.inv[index] = ""
}

func (self *Inventory) Consolidate() {
	for i := 0; i < self.capacity-1; i++ {
		if self.inv[i] != "" {
			continue
		}
		for j := i + 1; j < self.capacity; j++ {
			if self.inv[j] != "" {
				self.inv[i] = self.inv[j]
				self.inv[j] = ""
				break
			}
		}
		if self.inv[i] == "" {
			break
		}
	}
}

func (self *Inventory) Cycle(command string) {
	self.Consolidate()
	count := self.NumItems()

	if command == "b" {
		first := self.inv[0]
		for i := 0; i <= count-2; i++ {
			self.inv[i] = self.inv[i+1]
		}
		self.inv[count-1] = first
	} else {
		last := self.inv[count-1]
		for i := count - 1; i > 0; i-- {
			self.inv[i] = self.inv[i-1]
		}
		self.inv[0] = last
	}
	self.Owner.UpdateInventory()
}

func (self *Inventory) Use(index uint, holder Animat) {
	if int(index) > self.capacity || self.inv[index] == "" {
		return
	}

	log.Println(holder.ID() + " using " + self.inv[index])

	switch self.inv[index][0] {
	case 'f':
		// Don't let the player waste the food.
		if holder.IsAtMaxHealth() {
			return
		}
		holder.IncrementHealth(FOOD_HEALTH_INCREASE)
		self.inv[index] = ""
		self.Owner.UpdateInventory()

	case 'w':
		x, y := holder.Position()
		holder.Location().Broadcast(
			holder.Location().GetEvent(
				events.DIRECT_ATTACK,
				fmt.Sprintf("%f %f %s", x, y, self.inv[index]),
				holder,
			),
		)
	}

}

func (self *Inventory) Drop(dropper EntityThatCanThrow) {
	if self.inv[0] == "" {
		return
	}

	log.Println(dropper.ID() + " dropping " + self.inv[0])

	reg := dropper.Location()
	item := NewItemEntity(self.inv[0], dropper)
	self.inv[0] = ""
	reg.AddEntity(item)
	self.Consolidate()
	self.Owner.UpdateInventory()

}

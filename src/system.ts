import { Elevator, Floor } from "./types";

const isBetween = (n: number, a: number, b: number) => (n - a) * (n - b) <= 0

export default class BuildingSystem {
	eleOne: Elevator;
	eleTwo: Elevator;
	outsideRequests: Array<Floor>;
	maxCap: number;

	constructor() {
		this.eleOne = new Elevator();
		this.eleTwo = new Elevator();
		this.outsideRequests = [];
		this.maxCap = 400;
	}

	// polls which elevator to send
	call(floor: number, direction: 1 | -1): void {
		console.log(`\nCalled at floor ${floor} direction ${direction}`)
		if (floor < 0 || floor > 200) {
			// TODO: raise error
		}

		// TODO: check if floor is already pressed
		// if (this.floors[floor])

		// TODO: if the chosen ele is full, cannot use it

		// case 1: if both elevators are idle, send the nearest one
		if (this.eleOne.currentDirection == 0 && this.eleTwo.currentDirection == 0) {
			const chosenEle = this.getNearestElevator(this.eleOne, this.eleTwo, floor)
			this.addFloorToQueue(chosenEle, floor)
			return
		}

		// case 2: if one of the elevators is idle
		else if (this.eleOne.currentDirection == 0 || this.eleTwo.currentDirection == 0) {
			const idleEle = this.eleOne.currentDirection == 0 ? this.eleOne : this.eleTwo
			const busyEle = this.eleOne.currentDirection == 0 ? this.eleTwo : this.eleOne

			// case 2a: check if the busy one is going in the same direction as floor called
			let chosenEle = idleEle
			if (busyEle.currentDirection == direction) {
				// send the nearest one
				chosenEle = this.getNearestElevator(idleEle, busyEle, floor)
			} // else, send the idle one
			this.addFloorToQueue(chosenEle, floor)
			return
		}

		// case 3: both of the elevators are busy
		else {
			// choose the one which is going in the same direction as called
			// else, choose any
			const chosenEle = (direction == this.eleOne.currentDirection) ? this.eleOne : this.eleTwo
			this.addFloorToQueue(chosenEle, floor)
		}

	}

	addFloorToQueue(ele: Elevator, floor: number): void {
		// if it is between any of the floors already in the queue, then add there
		// else add at the end
		let indexToAdd = ele.floorsQueue.length
		for (let i = 0; i < ele.floorsQueue.length - 1; i++) {
			if (isBetween(floor, ele.floorsQueue[i], ele.floorsQueue[i + 1])) {
				indexToAdd = i + 1
			}
		}
		ele.floorsQueue = [...ele.floorsQueue.slice(0, indexToAdd), floor, ...ele.floorsQueue.slice(indexToAdd)]
		// console.log(`New queue ${ele.floorsQueue}`)
	}

	getNearestElevator(eleOne: Elevator, eleTwo: Elevator, floor: number): Elevator {
		const distOne = Math.abs(eleOne.currentFloor - floor)
		const distTwo = Math.abs(eleTwo.currentFloor - floor)

		return (distOne < distTwo) ? eleOne : eleTwo
	}

	boardPeople(ele: Elevator, numPeople: number, destinationFloor: number): boolean {
		const newTotal = ele.currentLoad + (numPeople * 60);
		if (newTotal > this.maxCap) {
			return false;
		}
		ele.currentLoad = newTotal;
		this.addFloorToQueue(ele, destinationFloor)
		return true;
	}
}
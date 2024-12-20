import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'

const Intro = () => {
	const [counter, setCounter] = useState(0);

	function incrementCounter() {
		setCounter(counter + 1);
	}

	useEffect(() => {
		fetch('http://localhost:9000/intro')
			.then((response) => {
				console.log('response:', response.text());
			})
			.then((response) => {
				console.log('response: ', response);
			})
			.catch((error) => {
				console.error('error: ', error);
			})
	}, [])


	function decrementCounter() {
		setCounter(counter - 1);
	}
	return (
		<div>
			Count: {counter}
			<Button onClick={incrementCounter}>
				INC
			</Button>
			<Button variant={"warning"} onClick={decrementCounter}>
				DEC
			</Button>
		</div>
	)
}

export default Intro
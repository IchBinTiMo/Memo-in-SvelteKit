export function clickOutside(node: HTMLElement) {
	// setup work goes here...
    // console.log(node);
	const handleClick = (event: any) => {
        // console.log(event)
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};
	
	document.addEventListener("click", handleClick, true);
	return {
		destroy() {
			// ...cleanup goes here
			document.removeEventListener("click", handleClick, true);
		}
	};
}

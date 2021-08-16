/* eslint-disable */
export const displayMap = (locations) => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoic3VsdGFub3ZtIiwiYSI6ImNrczE4bWF6bTB1OHQyeXJ3NHF0eWlhZDcifQ.bFdwGlnYb0wiyTNBPEldsg';

	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/sultanovm/cks23oium2i0u17mwb27nwd9v',
		scrollZoom: false
		// center: [-118.113491, 34.111745],
		// zoom: 15,
		//interactive: false // can not scroll 
	
	});
	
	const bounds = new mapboxgl.LngLatBounds();
	
	locations.forEach(loc => {
		// Create marker
		const el = document.createElement('div');
		el.className = 'marker'; // check style.css
	
		// Add marker
		new mapboxgl.Marker({
			element: el,
			anchor: 'bottom'
		})
			.setLngLat(loc.coordinates)
			.addTo(map); // tour.coordinates
	
		// Add popup
		new mapboxgl.Popup({
			offset: 35
		})
			.setLngLat(loc.coordinates)
			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
			.addTo(map);
	
		// Extends map bounds to include current location
		bounds.extend(loc.coordinates);
	});
	
	map.fitBounds(bounds, {
		padding: {
			top: 150,
			bottom: 150,
			left: 150,
			right: 150
		}
	});
}

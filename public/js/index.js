/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettigs} from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const updateData = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
// VALUES

// DELEGATION
if(mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

if(loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault(); // prevent after submit, when clicking
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	  });
}

if(updateData) {
	updateData.addEventListener('submit', (e) => {
		e.preventDefault(); // prevent after submit, when clicking
		//photo
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		console.log(form);
		
		updateSettigs(form, 'data');
	  });
}

if(updatePassword) {
	updatePassword.addEventListener('submit', async (e) => {
		e.preventDefault(); // prevent after submit, when clicking
		document.querySelector('.btn--save-password').textContent= 'Updating...';
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateSettigs({passwordCurrent, password, passwordConfirm}, 'password');
	  
		document.querySelector('.btn--save-password').textContent= 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';

	});
}

if(logOutBtn) {
	logOutBtn.addEventListener('click', logout);
}

if(bookBtn) {
	bookBtn.addEventListener('click', e=> {
		e.target.textContent = 'Processing...';
		const tourId = e.target.dataset.tourId;
		bookTour(tourId);
	})
}


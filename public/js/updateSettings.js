/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettigs = async (data, type) => {
	try {
		console.log(data);
		const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updatePassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
		const res = await axios({
			method: 'PATCH',
			url,
			data
		});
		if(res.data.status === 'success') {
			showAlert('success', `${type.toUpperCase()} Successfully updated!`);
			window.setTimeout(() => {
				location.assign('/me');
			}, 500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

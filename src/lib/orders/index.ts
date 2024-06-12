export const getLevel = (productName: string) => {
	switch (productName) {
		case 'Skailar Lite 1 Day R6':
			return 1;
		case 'Skailar Lite 3 Days R6':
			return 1;
		case 'Skailar Lite 7 Days R6':
			return 1;
		case 'Skailar Lite 30 Days R6':
			return 1;

		case 'Skailar 1 Day Rust':
			return 2;
		case 'Skailar 3 Days Rust':
			return 2;
		case 'Skailar 7 Days Rust':
			return 2;
		case 'Skailar 30 Days Rust':
			return 2;

		case 'Skailar 1 Day Fortnite':
			return 3;
		case 'Skailar 3 Days Fortnite':
			return 3;
		case 'Skailar 7 Days Fortnite':
			return 3;
		case 'Skailar 30 Days Fortnite':
			return 3;

		case 'Skailar 1 Day Apex':
			return 4;
		case 'Skailar 3 Days Apex':
			return 4;
		case 'Skailar 7 Days Apex':
			return 4;
		case 'Skailar 30 Days Apex':
			return 4;

		case 'Skailar 1 Day Valorant':
			return 5;
		case 'Skailar 3 Days Valorant':
			return 5;
		case 'Skailar 7 Days Valorant':
			return 5;
		case 'Skailar 30 Days Valorant':
			return 5;

		case 'Skailar 1 Day CS2':
			return 6;
		case 'Skailar 3 Days CS2':
			return 6;
		case 'Skailar 7 Days CS2':
			return 6;
		case 'Skailar 30 Days CS2':
			return 6;

		case 'Skailar Full 1 Day R6':
			return 7;
		case 'Skailar Full 3 Days R6':
			return 7;
		case 'Skailar Full 7 Days R6':
			return 7;
		case 'Skailar Full 30 Days R6':
			return 7;

		default:
			return 0;
	}
};

export const getExpiryInDays = (productName: string) => {
	switch (productName) {
		case 'Skailar Lite 1 Day R6':
			return 1;
		case 'Skailar Lite 3 Days R6':
			return 3;
		case 'Skailar Lite 7 Days R6':
			return 7;
		case 'Skailar Lite 30 Days R6':
			return 30;

		case 'Skailar 1 Day Rust':
			return 1;
		case 'Skailar 3 Days Rust':
			return 3;
		case 'Skailar 7 Days Rust':
			return 7;
		case 'Skailar 30 Days Rust':
			return 30;

		case 'Skailar 1 Day Fortnite':
			return 1;
		case 'Skailar 3 Days Fortnite':
			return 3;
		case 'Skailar 7 Days Fortnite':
			return 7;
		case 'Skailar 30 Days Fortnite':
			return 30;

		case 'Skailar 1 Day Apex':
			return 1;
		case 'Skailar 3 Days Apex':
			return 3;
		case 'Skailar 7 Days Apex':
			return 7;
		case 'Skailar 30 Days Apex':
			return 30;

		case 'Skailar 1 Day Valorant':
			return 1;
		case 'Skailar 3 Days Valorant':
			return 3;
		case 'Skailar 7 Days Valorant':
			return 7;
		case 'Skailar 30 Days Valorant':
			return 30;

		case 'Skailar 1 Day CS2':
			return 1;
		case 'Skailar 3 Days CS2':
			return 3;
		case 'Skailar 7 Days CS2':
			return 7;
		case 'Skailar 30 Days CS2':
			return 30;

		case 'Skailar Full 1 Day R6':
			return 1;
		case 'Skailar Full 3 Days R6':
			return 3;
		case 'Skailar Full 7 Days R6':
			return 7;
		case 'Skailar Full 30 Days R6':
			return 30;

		default:
			return 0;
	}
};

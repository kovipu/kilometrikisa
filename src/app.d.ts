/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

type CumulativeDataPoint = {
	date: number;
	total_distance: number;
};

type CumulativeData = {
	name: string;
	color: string;
	values: CumulativeDataPoint[];
};

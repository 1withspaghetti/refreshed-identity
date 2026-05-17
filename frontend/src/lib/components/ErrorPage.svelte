<script lang="ts">
	import { page } from '$app/state';
	import * as Alert from './ui/alert';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import Button from './ui/button/button.svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Meta from './Meta.svelte';

	let previousPage: string = $state(
		page.url.pathname.startsWith('/dashboard') ? resolve('/dashboard') : resolve('/')
	);

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});

	function goBack() {
		if (history.length > 1) {
			history.back();
		} else {
			goto(previousPage);
		}
	}
</script>

<Meta title="Error" description="An error occurred while loading this page." />

<div class="flex w-full flex-col items-center justify-center pt-24">
	<Alert.Root variant="destructive" class="w-full max-w-lg [&>svg]:size-5 [&>svg]:translate-y-1.5">
		<CircleAlertIcon />
		<Alert.Title class="text-xl">Error {page.status}</Alert.Title>
		<Alert.Description>
			<p>{page.error?.message || 'An unknown error occurred while loading this page.'}</p>
			<Button onclick={goBack} variant="outline" class="mt-4 text-foreground">Go back</Button>
		</Alert.Description>
	</Alert.Root>
</div>

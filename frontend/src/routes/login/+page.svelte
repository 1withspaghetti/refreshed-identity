<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href={resolve('/')} class="flex items-center gap-2 font-medium"> Refreshed Identity </a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginForm />
			</div>
		</div>
	</div>
	<div class="relative hidden bg-muted lg:block">
		<enhanced:img
			src="$lib/assets/imgs/william-fonteneau-3Sys5Fg7k7A-unsplash.jpg?w=1920;1080;540"
			title="By William Fonteneau on Unsplash"
			alt="a crowd of people holding rainbow colored flags"
			class="absolute inset-0 h-full w-full object-cover"
		/>
	</div>
</div>

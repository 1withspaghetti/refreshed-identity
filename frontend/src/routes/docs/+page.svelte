<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import { onMount } from 'svelte';
	import 'swagger-ui-dist/swagger-ui.css';
	import HeroHeader from '../HeroHeader.svelte';

	let containerElement: HTMLElement | undefined;
	let spec: object = $state({ openapi: '3.0.0', info: { title: 'API' }, paths: {} });

	async function initializeSwaggerUI() {
		if (!containerElement) return;

		try {
			const res = await fetch('/openapi.json');
			if (res.ok) spec = await res.json();

			const { SwaggerUIBundle, SwaggerUIStandalonePreset } = await import('swagger-ui-dist');

			SwaggerUIBundle({
				spec: spec,
				domNode: containerElement,
				deepLinking: true,
				presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset]
			});
		} catch (error) {
			console.error('Failed to initialize Swagger UI:', error);
		}
	}

	onMount(() => {
		initializeSwaggerUI();
	});
</script>

<Meta title="API Documentation" />

<HeroHeader />

<div class="swagger-container">
	<div id="swagger-ui-container" bind:this={containerElement}></div>
</div>

<style>
	.swagger-container {
		min-height: 600px;
		padding: 2rem;
	}

	/* Hide the default Swagger UI top bar */
	:global(.swagger-ui .topbar) {
		display: none;
	}
</style>

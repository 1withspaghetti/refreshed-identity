<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	type MetaProps = {
		title?: string;
		noTitleSuffix?: boolean;
		description?: string;
		image?: string;
		path?: string;
		author?: string;
	};

	let {
		title,
		noTitleSuffix = false,
		description,
		image,
		path = page.url.pathname,
		author
	}: MetaProps = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title}{noTitleSuffix ? '' : ' | AstroConnect'}</title>
		<meta property="og:title" content="{title}{noTitleSuffix ? '' : ' | AstroConnect'}" />
		<meta name="twitter:title" content="{title}{noTitleSuffix ? '' : ' | AstroConnect'}" />
	{/if}

	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}

	{#if author}
		<meta name="author" content={author} />
	{/if}

	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={image} />
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:url" content={new URL(path, PUBLIC_BASE_URL).href} />
</svelte:head>

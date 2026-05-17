<script lang="ts">
	import { page } from '$app/state';

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
		<title>{title}{noTitleSuffix ? '' : ' | Refreshed Identity'}</title>
		<meta property="og:title" content="{title}{noTitleSuffix ? '' : ' | Refreshed Identity'}" />
		<meta name="twitter:title" content="{title}{noTitleSuffix ? '' : ' | Refreshed Identity'}" />
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
	<meta property="og:url" content={new URL(path, "https://refreshed-identity.tyler.place/").href} />
</svelte:head>

<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import HeroHeader from './HeroHeader.svelte';
	import { IdCard, FingerprintPattern, Search, DatabaseSearch } from '@lucide/svelte';
	import Meta from '@/components/Meta.svelte';
</script>

<Meta noTitleSuffix title="Refreshed Identity" />

<div>
	<HeroHeader />
	<main class="flex flex-col items-center overflow-hidden pt-20 pb-32">
		<section class="max-w-8xl relative w-full">
			<enhanced:img
				class="absolute top-0 left-0 h-full w-full object-cover object-center"
				src="$lib/assets/imgs/raphael-renter-raphi_rawr-3Z7KBlydmiM-unsplash.jpg?w=2400;1920;1080"
				title="Photo by Raphael Renter on Unsplash"
				alt="a large crowd of people"
				sizes="(max-width: 1920px) 100vw"
			/>
			<div class="relative flex flex-col items-center bg-black/40 p-8 py-16 text-center text-white">
				<h1 class="mb-2 scale-x-125 text-4xl font-extrabold md:text-6xl">Uplift Yourself</h1>
				<h2 class="text-xl font-bold md:text-3xl">While throwing away the old <i>you</i></h2>
			</div>
		</section>
		<section class="py-8">
			<div class="flex gap-4">
				<Button href={resolve('/login')} size="lg" class="font-bold">
					<span class="text-nowrap">Refresh Your Identity</span>
				</Button>
				<Button
					href={resolve('/#how-it-works')}
					size="lg"
					variant="link"
					class="font-bold text-inherit"
				>
					<span class="text-nowrap">How It Works</span>
				</Button>
			</div>
		</section>
		<section class="container w-full bg-gray-50 px-8 py-16 dark:bg-transparent">
			<h2 id="how-it-works" class="mb-4 text-center text-2xl font-semibold md:text-3xl">
				How It Works:
			</h2>
			<div class="flex flex-wrap justify-center gap-4">
				<div class="flex w-48 flex-col items-center gap-4 p-4">
					<IdCard size={48} />
					<div class="text-center">Enter information on previous identities</div>
				</div>
				<div class="flex size-48 flex-col items-center gap-4 p-4">
					<FingerprintPattern size={48} />
					<div class="text-center">Data is hashed to prevent reverse lookups</div>
				</div>
				<div class="flex size-48 flex-col items-center gap-4 p-4">
					<Search size={48} />
					<div class="text-center">Browser Extension keeps everyone's identities up to date</div>
				</div>
				<div class="flex size-48 flex-col items-center gap-4 p-4">
					<DatabaseSearch size={48} />
					<div class="text-center">Enterprise Tools update at the source</div>
				</div>
			</div>
		</section>
	</main>
</div>

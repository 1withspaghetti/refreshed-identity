<script lang="ts" module>
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Settings from '@lucide/svelte/icons/settings';
	import FileSearch from '@lucide/svelte/icons/file-search';

	interface NavGroup {
		title: string;
		items: NavItem[];
	}

	interface NavItem {
		href: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		label: string;
	}

	export const navData: NavGroup[] = [
		{
			title: 'Manage My Identity',
			items: [
				{
					href: '/dashboard/refresh-identity',
					icon: FileSearch,
					label: 'Refresh Identity'
				}
			]
		},
		{
			title: 'General',
			items: [
				{
					href: '/dashboard/profile',
					icon: UserPen,
					label: 'Edit Profile'
				},
				{
					href: '/dashboard/settings',
					icon: Settings,
					label: 'Settings'
				}
			]
		}
	];
</script>

<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '@/components/ui/separator';
	import DashboardSidebar from './dashboard-sidebar.svelte';
	import { page } from '$app/state';
	import Meta from '@/components/Meta.svelte';

	let { children, data }: LayoutProps = $props();

	let currentNavItem = $derived(
		navData.flatMap((group) => group.items).find((item) => page.url.pathname.startsWith(item.href))
	);
</script>

<Meta title="Dashboard" />

<Sidebar.Provider>
	<DashboardSidebar user={data.user} />
	<Sidebar.Inset class="h-screen">
		<header class="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root class="max-w-full overflow-x-hidden">
				<Breadcrumb.List class="flex-nowrap justify-end whitespace-nowrap">
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					{#if currentNavItem}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Link href={currentNavItem.href}>{currentNavItem.label}</Breadcrumb.Link>
						</Breadcrumb.Item>
					{/if}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="relative h-full overflow-y-auto">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

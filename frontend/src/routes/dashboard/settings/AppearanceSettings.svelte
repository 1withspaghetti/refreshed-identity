<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '@/components/ui/label';
	import * as Select from '@/components/ui/select';
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
</script>

<Card.Root class="w-full max-w-lg">
	<Card.Header>
		<Card.Title>App Appearance</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-6">
			<div class="space-y-2">
				<Label>Theme</Label>
				<Select.Root
					type="single"
					value={userPrefersMode.current}
					onValueChange={(value) => {
						if (value === 'system') resetMode();
						else setMode(value as 'light' | 'dark');
					}}
				>
					<Select.Trigger>
						{userPrefersMode.current === 'system'
							? 'System Default'
							: userPrefersMode.current == 'dark'
								? 'Dark Mode'
								: 'Light Mode'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="light" label="Light Mode" />
						<Select.Item value="dark" label="Dark Mode" />
						<Select.Item value="system" label="System Default" />
					</Select.Content>
				</Select.Root>
				<div class="text-sm text-muted-foreground">
					This is just saved on this device and will not affect other devices.
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

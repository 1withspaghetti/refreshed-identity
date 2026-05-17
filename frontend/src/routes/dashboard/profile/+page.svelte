<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { profileEditSchema } from '@/validators/profileEditValidator';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import dayjs from 'dayjs';
	import { toast } from 'svelte-sonner';
	import Meta from '@/components/Meta.svelte';
	import UserAvatar from '@/components/UserAvatar.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let form = superForm(data.form, {
		validators: zod4Client(profileEditSchema),
		dataType: 'json',
		taintedMessage: true,
		resetForm: false,
		onUpdated: ({ form }) =>
			form.message &&
			toast[form.message.type as 'success' | 'error'](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	let { form: formData, enhance, submitting, tainted } = form;

	const user = $derived(data.user);
</script>

<Meta title="Profile" />

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-16 w-full max-w-lg">
		<Card.Header class="pt-8">
			<div class="flex justify-center">
				<UserAvatar {user} class="absolute size-24 -translate-y-full" />
			</div>
			<Card.Title>Edit Profile</Card.Title>
			<Card.Description>
				This will be included in every application you send, and on every research opportunity you
				post.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-6">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Display Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
							<Form.Description>
								Please enter your full name or a name you would like to be known by.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex gap-2">
					<Button type="submit" disabled={$submitting || !$tainted}>Save</Button>
					<Button
						type="reset"
						variant="secondary"
						disabled={!$tainted}
						onclick={(e) => {
							e.preventDefault();
							form.reset();
						}}
					>
						Reset
					</Button>
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex-wrap justify-between gap-x-2 text-sm text-muted-foreground">
			<span>
				<u>Signed Up:</u>
				<span title={dayjs(user.firstLogin).format('LLLL')}
					>{dayjs(user.firstLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>Last Login:</u>
				<span title={dayjs(user.lastLogin).format('LLLL')}
					>{dayjs(user.lastLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>User ID:</u> <span>{user.id}</span>
			</span>
		</Card.Footer>
	</Card.Root>
</div>

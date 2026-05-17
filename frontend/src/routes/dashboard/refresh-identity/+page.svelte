<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import Meta from '@/components/Meta.svelte';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import { identityCreateSchema } from '@/validators/identityEditValidator';
	import { Eye, EyeClosed } from '@lucide/svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let form = superForm(data.form, {
		validators: zod4Client(identityCreateSchema),
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

	let deadnameShown = $state(false);
</script>

<Meta title="Profile" />

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-16 w-full max-w-lg">
		<Card.Header class="pt-8">
			<div class="flex justify-center">
				<UserAvatar {user} class="absolute size-24 -translate-y-full" />
			</div>
			<Card.Title>Refresh your Identity</Card.Title>
			<Card.Description>
				This information will be hashed to prevent reverse lookup and then provided to companies to ensure your data is accurate.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-6">
				<Form.Field {form} name="deadname">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Deadname</Form.Label>
							<div class="relative flex gap-2 items-center">
								<Input {...props} type={deadnameShown ? "text" : "password"} bind:value={$formData.deadname} />
								<Button variant="secondary" size="lg" onclick={() => deadnameShown = !deadnameShown}>
									{#if deadnameShown}
										<Eye />
									{:else}
										<EyeClosed />
									{/if}
								</Button>
							</div>
							<Form.Description>
								Please enter your full deadname (first + last) to be searched for. Don't worry, nobody else can see this.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} type="email" bind:value={$formData.email} />
							<Form.Description>
								Email associated with accounts or data using your deadname.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="replacement">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.replacement} />
							<Form.Description>
								The new name you would be known by!
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
	</Card.Root>
</div>

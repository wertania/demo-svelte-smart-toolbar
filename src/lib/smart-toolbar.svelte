<svelte:options tag="smart-toolbar" />

<script lang="ts">
	import { fade, fly, slide, scale } from "svelte/transition";
	import "../app.css";
	
	export interface MenuItem {
    // meta
    name: string; // unique name
    label?: string;
    // style
    icon?: string;
    // type
    input?: {
        type: 'date' | 'datetime-local' | 'text' | 'select' | 'checkbox' | 'radio';        
        options?: { label: string, value: any }[];
        placeholder?: string;
        update: (data: any) => void;
        bindValueKey?: string;
    } // if set, type will be an input. if not set, type will be a button      
    items?: MenuItem[]; // if set, type will be a button and click will open its items as new main items
    subMenuItems?: MenuItem[]; // is set, type will be a button and click will open a sub menu
    // action
    action?: (name: string) => void; // if set, type will be a button and click will call this action
}

	export let items: MenuItem[] = [
		{
			name: "init",
			label: "init",
			action() {
				console.log("init");
			},
		},
	];

	// show labels for top level entries
	export let showLabels: boolean = false;
	// show labels for sub entries. will instead also used for hints
	export let showSubLabels: boolean = false;

	export let boundValues: any = {};

	// global style
	export let style: any = {
		"background-color": "white",
		height: "50px",
		width: "100%",
	};
	$: cssStyle = Object.entries(style)
		.map(([key, value]) => `${key}:${value}`)
		.join(";");

	// entries for menu
	// visible top level entries
	let selectedItems: MenuItem[] = items;
	// selected mene item entry
	let selectedEntry: null | MenuItem = null;
	// selected menu item submenu
	let selectedSubItems: null | MenuItem[] = null;
	// active entry name
	let activeEntry: null | string = null;

	// start entry
	const updateItemsFromParent = (e: MenuItem[]) => {
		console.log("updateItemsFromParent", e);
		selectedItems = e;
	};
	$: watchItems = updateItemsFromParent(items);

	// select an menu item
	const jumpIn = (item: MenuItem) => {
		if (item.name === activeEntry) {
			selectedSubItems = null;
			selectedSubItems = null;
		} else {
			if (item.items) {
				selectedEntry = item;
				selectedItems = item.items;
				selectedSubItems = null;
				activeEntry = item.name;
			} else if (item.action) {
				item.action(item.name);
			} else if (item.subMenuItems) {
				activeEntry = item.name;
				selectedSubItems = item.subMenuItems;
			}
		}
	};

	// go back to previous menu
	const jumpOut = () => {
		selectedEntry = null;
		selectedSubItems = null;
		selectedItems = items;
	};

	// pause 500ms before showing menu
	let showMenu: boolean = false;
	setTimeout(() => {
		showMenu = true;
	}, 500);

	let showHints: boolean = false;
	const showAllHints = () => {
		showHints = true;
		setTimeout(() => {
			showHints = false;
		}, 2000);
	};

	const forwardValue = (event: any, updateFunc: any) => {
		if (event.target.value) {
			updateFunc(event.target.value);
		}
	};
</script>

<!-- {@debug items}
{@debug cssStyle} -->

<!-- FIRST ROW: Main entries -->
<div style={cssStyle} class="flex items-center text-xl">
	<!-- Slot Header/Icon -->
	<div class="ml-2 flex-none">
		<slot name="before" />
	</div>
	<!-- Selected Icon -->
	{#if selectedEntry}
		<div
			class="flex items-center"
			in:scale={{ duration: 250 }}
			out:scale={{ duration: 250 }}
			on:click={() => jumpOut()}
			on:keydown={(event) => {
				if (event.key === "Escape") jumpOut();
			}}
		>
			<button class="ml-2 mr-2 flex-none">
				{#if selectedEntry.icon}
					<i class={selectedEntry.icon} />
				{/if}
				{#if selectedEntry.label && showLabels}
					<span>{selectedEntry.label}</span>
				{/if}
			</button>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z"
					fill="currentColor"
				/>
			</svg>
		</div>
	{/if}
	<!-- Icon List -->
	<div class="grow">
		<div class="flex justify-start items-center text-gray-500">
			<!-- iterate items in main menu -->
			{#if showMenu}
				{#each selectedItems as item}
					{#if item.input == null}
						<button
							in:scale={{ duration: 250 }}
							class="ml-3"
							on:click={() => jumpIn(item)}
						>
							{#if item.icon}
								<i class={item.icon} />
							{/if}
							{#if item.label && showLabels}
								<span>{item.label}</span>
							{/if}
						</button>
					{:else if item.input?.type === "date"}
						<input type="date" />
					{:else if item.input?.type === "text"}
						<input type="text" />
					{:else if item.input?.type === "select"}
						<select
							on:change={(e) =>
								forwardValue(e, item.input?.update)}
							value={item.input.bindValueKey
								? boundValues[item.input.bindValueKey]
								: undefined}
						>
							{#if item.input.options}
								{#each item.input.options as opt}
									<option value={opt.value}
										>{opt.label}</option
									>
								{/each}
							{/if}
						</select>
					{:else if item.input?.type === "checkbox"}
						<input type="checkbox" />
					{:else if item.input?.type === "radio"}
						<input type="radio" />
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<!-- Slot After -->
	<div class="flex-none w-14">
		<slot name="after" />
	</div>
</div>
<!-- SECOND ROW subentries -->
{#if selectedSubItems}
	<div class="grid grid-cols-1 bg-white">
		{#each selectedSubItems as subItem}
			<div class="flex justify-start items-center p-2 text-xl">
				{#if subItem.input == null}
					<!-- Button -->
					<button
						in:slide={{ duration: 500 }}
						on:click={() => jumpIn(subItem)}
					>
						{#if subItem.icon}
							<i class={subItem.icon} />
						{/if}
						{#if subItem.label}
							<span>{subItem.label}</span>
						{/if}
					</button>
				{:else}
					<!-- Inputs -->
					<!-- Icon at start -->
					{#if subItem.icon}
						<i
							class={subItem.icon + " mr-2 flex-none"}
							on:click={() => showAllHints()}
							on:keypress={(event) => {
								if (event.key === "?") showAllHints();
							}}
						/>
					{/if}
					<!-- label as hint -->
					{#if showHints && !showSubLabels}
						<span
							class="fixed bg-slate-200 left-8 text-lg pt-1 pb-1 pl-2 pr-2 rounded-md flex items-center"
						>
							<svg
								width="24"
								clip-rule="evenodd"
								fill-rule="evenodd"
								stroke-linejoin="round"
								stroke-miterlimit="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="m13.789 7.155c.141-.108.3-.157.456-.157.389 0 .755.306.755.749v8.501c0 .445-.367.75-.755.75-.157 0-.316-.05-.457-.159-1.554-1.203-4.199-3.252-5.498-4.258-.184-.142-.29-.36-.29-.592 0-.23.107-.449.291-.591 1.299-1.002 3.945-3.044 5.498-4.243z"
								/>
							</svg>
							{subItem.label}
						</span>
					{/if}
					<!-- fixed label if "showLabel"-->
					{#if subItem.label && showSubLabels}
						<span class="mr-2 flex-none">{subItem.label}</span>
					{/if}
					<!-- input -->
					<div class="grow">
						{#if subItem.input.type === "text"}
							<input
								class="w-full"
								type="text"
								placeholder={subItem.input.placeholder ?? ""}
								value={subItem.input.bindValueKey
									? boundValues[subItem.input.bindValueKey]
									: undefined}
								on:input={(e) =>
									forwardValue(e, subItem.input?.update)}
							/>
						{:else if subItem.input.type === "date"}
							<input
								class="w-full"
								type="date"
								value={subItem.input.bindValueKey
									? boundValues[subItem.input.bindValueKey]
									: undefined}
								on:change={(e) =>
									forwardValue(e, subItem.input?.update)}
							/>
						{:else if subItem.input.type === "datetime-local"}
							<input
								class="w-full"
								type="datetime-local"
								value={subItem.input.bindValueKey
									? boundValues[subItem.input.bindValueKey]
									: undefined}
								on:change={(e) =>
									forwardValue(e, subItem.input?.update)}
							/>
						{:else if subItem.input.type === "select"}
							<select
								class="w-full"
								on:change={(e) =>
									forwardValue(e, subItem.input?.update)}
								value={subItem.input.bindValueKey
									? boundValues[subItem.input.bindValueKey]
									: undefined}
							>
								{#if subItem.input.options}
									{#each subItem.input.options as opt}
										<option value={opt.value}
											>{opt.label}</option
										>
									{/each}
								{/if}
							</select>
						{:else if subItem.input.type === "checkbox"}
							<input
								class="w-full"
								type="checkbox"
								value={subItem.input.bindValueKey
									? boundValues[subItem.input.bindValueKey]
									: undefined}
								on:change={(e) =>
									forwardValue(e, subItem.input?.update)}
							/>
						{:else if subItem.input.type === "radio"}
							<input class="w-full" type="radio" />
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	/* @tailwind base;
	@tailwind components;
	@tailwind utilities; */
</style>

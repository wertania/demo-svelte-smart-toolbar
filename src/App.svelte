<svelte:options tag={null} />

<script lang="ts">
  import type { MenuItem } from "./lib/interface";
  import SmartToolbar from "./lib/smart-toolbar.svelte";

  let bindTest = {
    interval: "P1W",
    test2: "abc",
    start: "2021-12-31T23:00:00",
    timespan: "P1D",
    chartType: "line",
  };

  const menu: MenuItem[] = [
    // chart settings
    {
      name: "chart-settings",
      icon: "fa fa-clock",
      subMenuItems: [
        {
          name: "timespan",
          icon: "fa fa-calendar-alt",
          label: "Timespan",
          input: {
            type: "select",
            options: [
              {
                label: "1 day",
                value: "P1D",
              },
              {
                label: "1 week",
                value: "P1W",
              },
              {
                label: "1 month",
                value: "P1M",
              },
              {
                label: "1 year",
                value: "P1Y",
              },
            ],
            update(val) {
              bindTest.timespan = val;
            },
            bindValueKey: "timespan",
          },
        },
        {
          name: "interval",
          icon: "fa fa-clock",
          label: "Interval",
          input: {
            type: "select",
            options: [
              {
                label: "15min",
                value: "PT15M",
              },
              {
                label: "1 day",
                value: "P1D",
              },
              {
                label: "1 week",
                value: "P1W",
              },
              {
                label: "1 month",
                value: "P1M",
              },
              {
                label: "1 year",
                value: "P1Y",
              },
            ],
            update(val) {
              bindTest.interval = val;
            },
            bindValueKey: "interval",
          },
        },
      ],
    },
    // times
    {
      name: "times",
      icon: "fa fa-arrows-left-right-to-line",
      subMenuItems: [
        {
          name: "start-ts",
          label: "Start Timestamp",
          icon: "fa fa-arrow-right-from-bracket",
          input: {
            type: "datetime-local",
            update(val) {
              bindTest.start = val;
            },
            bindValueKey: "start",
          },
        },
        {
          name: "end-ts",
          label: "End Timestamp",
          icon: "fa fa-arrow-right-to-bracket",
          input: {
            type: "datetime-local",
            update(val) {
              console.log(val);
            },
          },
        },
      ],
    },
    // move timestamps
    {
      name: "move-previous",
      icon: "fa fa-chevron-left",
      action: (name) => {
        console.log(name);
      },
    },
    {
      name: "move-next",
      icon: "fa fa-chevron-right",
      action: (name) => {
        console.log(name);
      },
    },
    {
      name: "chart-type",
      icon: "fa fa-chart-line",
      items: [
        {
          name: "input-chart-type",
          input: {
            type: "select",
            options: [
              {
                label: "Line",
                value: "line",
              },
              {
                label: "Bar",
                value: "bar",
              },
              {
                label: "Area",
                value: "area",
              },
            ],
            update(val) {
              bindTest.chartType = val;
            },
            bindValueKey: "chartType",
          },
        },
      ],
    },
    {
      name: "share",
      icon: "fa fa-share",
      subMenuItems: [
        {
          name: "export-url",
          icon: "fa fa-link",
          label: "Export URL",
          action: (name) => {
            console.log("send link");
          },
        },
      ],
    },
  ];

  const menu2: MenuItem[] = [
    // chart settings
    {
      name: "chart-settings",
      icon: "fa fa-clock",
    },
  ];

  let menuToggled = true;
</script>

<!-- {@debug count} -->

<div class="container">
  <SmartToolbar
    items={menuToggled ? menu : menu2}
    showLabels={false}
    showSubLabels={false}
    boundValues={bindTest}
  >
    <div slot="before">
      <i class="fa fa-home text-3xl text-gray-600" />
    </div>
    <!-- <div slot="after">
			<i class="fa fa-circle-question text-3xl text-gray-600" />
		</div> -->
  </SmartToolbar>
</div>

<div class="mt-5">
  <button
    on:click={() => {
      bindTest.interval = "P1W";
      bindTest.test2 = "def";
      bindTest.start = "2025-12-31T23:00:00";
    }}>Change Start</button
  >
  <button
    on:click={() => {
      console.log("change menu");
      menuToggled = !menuToggled;
    }}>Change Menu</button
  >
</div>

<style>
  @import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
  
  .container {
    margin: 0 auto;
    width: 100%;
    height: 200px;
    margin-top: 100px;
  }
</style>

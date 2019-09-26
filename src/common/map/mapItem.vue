<template>
  <div class="chart-wrapper">
    <div ref="chart" class="chart-element"></div>
  </div>
</template>

<script>
    import echarts from 'echarts';
    import 'echarts/extension/bmap/bmap';
    export default {
      name: "mapItem",
      props: {
        option: Object,
      },
      methods: {
        handleOption() {
          this.chart.setOption(this.option);
        }
      },
      watch: {
        option() {
          this.handleOption();
        }
      },
      mounted() {
        this.chart = echarts.init(this.$refs.chart, 'default');
        if (this.option) {
          this.$nextTick(() => {
            this.handleOption();
          });
        }
      },
      beforeDestroy() {
        this.chart.dispose();
        this.chart = null;
      }
    }
</script>
<style>
  .chart-wrapper, .chart-element {
    height: 100%;
  }

  .chart-element {
    width: 100%;
  }
</style>

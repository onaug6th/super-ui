<template>
  <div role="presentation" class="dropdown open" v-clickoutside="clickoutside">
    <a class="dropdown-toggle" role="button" @click="toggleMenu(true)">
      {{countSelectText()}}
      <span class="caret"></span>
    </a>
    <ul class="dropdown-menu" v-show="isOpen">
      <li v-for="(item, index) in config.list" :key="index" @click="selectItem(item)">
        <div v-if="item.divider" role="separator" class="divider"></div>
        <a :data-index="index">{{item.value}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Clickoutside from "../utils/clickoutside";

export default {
  name: "SSelect",
  props: {
    config: {
      type: Object,
      required: false,
      default() {
        return {
          label: "请选择",
          value: "",
          list: []
        };
      }
    }
  },
  directives: { Clickoutside },
  data() {
    return {
      isOpen: false,
      selected: ""
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 切换打开菜单
     * @param {string} type 类型
     */
    toggleMenu(type) {
      this.isOpen = type;
    },
    /**
     * 选中某一行
     * @param {object} item 当前行对象
     */
    selectItem(item) {
      if (this.selected.key == item.key) {
        this.selected = "";
      } else {
        this.selected = item;
        this.config.value = item.key;
        this.$emit("selected", item.key, item);
      }
      this.toggleMenu(false);
    },
    /**
     * 计算显示的文字
     */
    countSelectText() {
      if (this.selected.key) {
        return this.selected.value;
      } else {
        return this.config.label || "请选择";
      }
    },
    /**
     * 点击了绑定元素以外时的回调事件
     */
    clickoutside() {
      this.toggleMenu(false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

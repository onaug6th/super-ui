<template>
  <div role="presentation" class="dropdown open" v-clickoutside="clickoutside">
    <a class="dropdown-toggle" role="button" @click="toggleMenu()">
      {{countSelectText()}}
      <span class="caret"></span>
    </a>
    <ul class="dropdown-menu" v-show="cfg.isOpen">
      <li v-for="(item, index) in cfg.list" :key="index" @click="selectItem(item)">
        <div v-if="item.divider" role="separator" class="divider"></div>
        <a :data-index="index">{{item.value}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Clickoutside from "@/utils/clickoutside";

export default {
  name: "SSelect",
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  directives: { Clickoutside },
  data() {
    return {
      cfg: this.config
    };
  },
  watch: {
    "cfg.selected.key"() {
      this.countSelectText();
    }
  },
  computed: {},
  created() {
    const cfg = this.cfg;
    const defaultConfig = {
      label: "请选择",
      isOpen: false,
      selected: {
        key: "",
        value: ""
      },
      defaultKey: "",
      list: []
    }
    for(let i in defaultConfig){
      !cfg[i] && (this.$set(cfg, i, defaultConfig[i]));
    }
    const defaultKey = this.cfg.defaultKey;
    if(defaultKey){
      const defaultObj = this.cfg.list.filter(item =>{
        if(item.key === defaultKey) {
          return item;
        }
      })[0];
      if(defaultObj){
        this.cfg.selected.key = defaultKey;
        this.cfg.selected.value = defaultObj.value;
      }
    }
  },
  methods: {
    openMenu(type) {
      this.cfg.isOpen = type; 
    },
    /**
     * 切换打开菜单
     */
    toggleMenu() {
      this.cfg.isOpen = !this.cfg.isOpen;
    },
    /**
     * 选中某一行
     * @param {object} item 当前行对象
     */
    selectItem(item) {
      if (this.cfg.selected.key == item.key) {
        this.cfg.selected = {};
      } else {
        this.cfg.selected = item;
        this.$emit("selected", item.key, item);
      }
      this.openMenu(false);
    },
    /**
     * 计算显示的文字
     */
    countSelectText() {
      if (this.cfg.selected && this.cfg.selected.key) {
        return this.cfg.selected.value;
      } else {
        return this.cfg.label || "请选择";
      }
    },
    /**
     * 点击了绑定元素以外时的回调事件
     */
    clickoutside() {
      this.openMenu(false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./select.scss";
</style>

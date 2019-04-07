<script>
import Bar from "./bar";

function resizeHandler(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
}

const addResizeListener = function(element, fn) {
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

const removeResizeListener = function(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};

let scrollBarWidth;

function barWidth() {
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement("div");
  outer.className = "el-scrollbar__wrap";
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
}

function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

export default {
  name: "SScrollbar",
  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: "div"
    }
  },

  data() {
    return {
      sizeWidth: "0",
      sizeHeight: "0",
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  render(h) {
    let gutter = barWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === "string") {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(
      this.tag,
      {
        class: ["el-scrollbar__view", this.viewClass],
        style: this.viewStyle,
        ref: "resize"
      },
      this.$slots.default
    );
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[
          this.wrapClass,
          "el-scrollbar__wrap",
          gutter ? "" : "el-scrollbar__wrap--hidden-default"
        ]}
      >
        {[view]}
      </div>
    );
    let nodes;

    if (!this.native) {
      nodes = [
        wrap,
        <Bar move={this.moveX} size={this.sizeWidth} />,
        <Bar vertical move={this.moveY} size={this.sizeHeight} />
      ];
    } else {
      nodes = [
        <div
          ref="wrap"
          class={[this.wrapClass, "el-scrollbar__wrap"]}
          style={style}
        >
          {[view]}
        </div>
      ];
    }
    return h("div", { class: "el-scrollbar" }, nodes);
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + "%" : "";
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + "%" : "";
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
</script>

<style>
.el-select-dropdown .el-scrollbar.is-empty .el-select-dropdown__list {
  padding: 0;
}

.el-time-spinner__wrapper
  .el-scrollbar__wrap:not(.el-scrollbar__wrap--hidden-default) {
  padding-bottom: 15px;
}

.el-scrollbar {
  overflow: hidden;
  position: relative;
}

.el-scrollbar:active > .el-scrollbar__bar,
.el-scrollbar:focus > .el-scrollbar__bar,
.el-scrollbar:hover > .el-scrollbar__bar {
  opacity: 1;
  transition: opacity 0.34s ease-out;
}

.el-scrollbar__wrap {
  overflow: scroll;
  height: 100%;
}

.el-scrollbar__wrap--hidden-default::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.el-scrollbar__thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144, 147, 153, 0.3);
  transition: background-color 0.3s;
}

.el-scrollbar__thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}

.el-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.12s ease-out;
}

.el-scrollbar__bar.is-vertical {
  width: 6px;
  top: 2px;
}

.el-scrollbar__bar.is-vertical > div {
  width: 100%;
}

.el-scrollbar__bar.is-horizontal {
  height: 6px;
  left: 2px;
}

.el-scrollbar__bar.is-horizontal > div {
  height: 100%;
}
</style>

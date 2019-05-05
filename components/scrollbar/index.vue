<script>
import Bar from "./bar";

/**
 * 窗口缩放执行回调
 */
function resizeHandler(entries) {
  //  entry是ResizeObserver构造函数执行时传入的参
  for (let entry of entries) {
    //  取出之前声明的回调函数数组
    const listeners = entry.target.__resizeListeners__ || [];
    //  遍历执行回调
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
}

/**
 * 添加尺寸改变时事件监听
 * @param {HTMLDivElement} element 元素
 * @param {Function} fn 回调
 */
const addResizeListener = function(element, fn) {
  debugger;
  if (!element.__resizeListeners__) {
    //  设置当前元素的事件回调数组
    element.__resizeListeners__ = [];
    //  实例化Resize观察者对象
    element.__ro__ = new ResizeObserver(resizeHandler);
    //  开始观察指定的目标元素，当元素尺寸改变时，会执行resizeHandler方法
    element.__ro__.observe(element);
    window.ro = element.__ro__;
  }
  //  往回调数组中添加本次监听事件
  element.__resizeListeners__.push(fn);
};

/**
 * 移除尺寸改变时事件监听
 * @param {VNode} element 元素
 * @param {Function} fn 回调
 */
const removeResizeListener = function(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  //  数组中移除
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  //  取消目标对象上所有对element的观察
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

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

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
      window.wrap = this.$refs.wrap;
      return this.$refs.wrap;
    }
  },

  render(h) {
    
    /**
     * 滚动条宽度
     */
    let gutter = barWidth();
    let style = this.wrapStyle;
    
    //  如果存在滚动条宽度
    if (gutter) {
      //  设置偏移宽度，隐藏原生滚动条
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
      
      //  根据配置类型，生成样式
      /**
       * 如是对象数组属性 Array<Object> [{"background": "red"}, {"color": "red"}]
       * 则会被转为对象  {background: "red", color: "red"}
       */
      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } 
      //  如是字符串，直接拼接
      else if (typeof this.wrapStyle === "string") {
        style += gutterStyle;
      }
      //  否则直接赋值
      else {
        style = gutterStyle;
      }
    }

    //  生成view
    const view = h(
      //  view的标签类型
      this.tag,
      //  view的属性
      {
        class: ["el-scrollbar__view", this.viewClass],
        style: this.viewStyle,
        ref: "resize"
      },
      //  接收的插槽内容
      this.$slots.default
    );

    //  生成wrap，并监听滚动事件
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
    
    //  如果不使用原生滚动条，则添加自定义滚动条
    if (!this.native) {
      /**
       * <div class="el-scrollbar__wrap">
       *  <div class="el-scrollbar__view"></div>
       * </div>
       * <bar>
       * <bar>
       */
      nodes = [
        wrap,
        <Bar move={this.moveX} size={this.sizeWidth} />,
        <Bar vertical move={this.moveY} size={this.sizeHeight} />
      ];
    } else {
      /**
       * 否则使用原生滚动条
       * 
       * <div class="el-scrollbar__wrap"> wrap并无监听滚动事件
       *  <div class="el-scrollbar__view"></div>
       * </div>
       * <bar>
       * <bar>
       */
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
    
    //  返回最终结构
    return h("div", { class: "el-scrollbar" }, nodes);
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },

update() {
  //  声明高度百分比，宽度百分比
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
    //  如使用原生滚动条，返回
    if (this.native) return;
    //  在下一更新循环结束执行更新方法
    this.$nextTick(this.update);
    //  根据配置进行监听内容窗口重置事件，执行更新方法
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    //  如使用原生滚动条，返回
    if (this.native) return;
    //  根据配置移除监听内容窗口重置事件的执行更新方法
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
</script>

<style>
@import "./index.scss";
</style>

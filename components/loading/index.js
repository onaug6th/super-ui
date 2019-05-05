import Vue from 'vue';
import loadingVue from './loading.vue';
import directive from './directive';
import { addClass, removeClass, getStyle } from '../utils/dom';
import afterLeave from '../utils/after-leave';
import merge from '../utils/merge';

/**
 * 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象
 * docs: https://cn.vuejs.org/v2/api/#Vue-extend
 */
const LoadingConstructor = Vue.extend(loadingVue);

//  默认配置
const defaults = {
  //  加载展示的文本
  text: null,
  //  全屏
  fullscreen: true,
  //  覆盖于body之上
  body: false,
  //  锁定屏幕滚动
  lock: false,
  //  自定义样式名称
  customClass: ''
};

//  闭包变量，用于存储以服务形式打开的加载遮罩层
let fullscreenLoading;

//  ???
LoadingConstructor.prototype.originalPosition = '';
LoadingConstructor.prototype.originalOverflow = '';

//  关闭加载方法
LoadingConstructor.prototype.close = function () {
  //  fullscreen调用一般为服务调用，所以会存储为闭包
  if (this.fullscreen) {
    fullscreenLoading = undefined;
  }
  //  关闭后的回调
  afterLeave(this, _ => {
    const target = this.fullscreen || this.body
      ? document.body
      : this.target;
    //  对调用的目标移除样式
    removeClass(target, 'el-loading-parent--relative');
    removeClass(target, 'el-loading-parent--hidden');
    //  在dom中移除标签
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    //  摧毁实例
    this.$destroy();
  }, 300);
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  let maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
    maskStyle.zIndex = 999;
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    ['top', 'left'].forEach(property => {
      let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = options.target.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px';
    });
    ['height', 'width'].forEach(property => {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property];
  });
};

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return;
  //  合并传入的对象，并返回合并后的新对象
  options = merge({}, defaults, options);
  
  //  传入字符串，用于querySelector选择器
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  //  存在判断
  options.target = options.target || document.body;
  
  //  不为body，说明不需要全屏
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  //  如果传入配置为全屏，说明以服务调用，且存在闭包，直接返回同个对象
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }
  
  //  父级标签
  let parent = options.body ? document.body : options.target;
  //  根据配置实例化组件
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  });

  //  为调用父级标签增加属性
  addStyle(options, parent, instance);
  //  ???
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative');
  }
  //  全屏且锁，增加样式
  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden');
  }
  //  追加加载遮罩层
  parent.appendChild(instance.$el);
  //  下一循环，修改 可见 属性
  Vue.nextTick(() => {
    instance.visible = true;
  });
  //  如为服务调用，保存闭包
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  //  最后返回实例
  return instance;
};

export default {
  install(Vue) {
    Vue.use(directive);
    Vue.prototype.$loading = Loading;
  },
  directive,
  service: Loading
};

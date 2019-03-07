import Vue from 'vue';

//  绑定指令的节点列表
const nodeList = [];
//  上下文标记，用于删除回收
const ctx = '@@clickoutsideContext';

//  闭包变量，储存开始点击位置信息
let startClick;
//  uuid
let seed = 0;

/**
 * 基于addEventListener封装的监听方法
 * @param {*} element
 * @param {*} event
 * @param {*} handler
 */
const on = function (element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};

//  鼠标点击时，记录开始点击目标信息
!Vue.prototype.$isServer && on(document, 'mousedown', e => {
  startClick = e;
});

//  鼠标放开时，执行所有绑定了指令的节点方法。documentHandler
!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => {
    node[ctx].documentHandler(e, startClick)
  });
});

/**
 * 鼠标放开后的回调事件，对比新后点击目标
 * @param {*} el 挂靠的DOM节点
 * @param {*} binding 绑定的部分信息
 * @param {*} vnode 虚拟DOM节点
 */
function createDocumentHandler(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {
    //  如果没有目标，返回
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target
    ) {
      return;
    }
    //  如果包含目标
    if(
      el.contains(mouseup.target) ||
      el.contains(mousedown.target)
    ){
      return;
    }
    //  如果包含目标
    if (

      el === mouseup.target ||
      (
        vnode.context.popperElm &&

        (
          vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)
        )
      )
    ) {
      return;
    }

    //  排除以上判断，说明点击了绑定元素以外的地方。执行回调
    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose"></div>
 * ```
 */
export default {
  //  指令第一次绑定到元素时调用，初始化回调处理
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },
  //  所在组件的 VNode 更新时调用
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  //  指令与元素解绑时调用
  unbind(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};

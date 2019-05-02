import { on, off } from "../utils/index";

const BAR_MAP = {
    vertical: {
        offset: 'offsetHeight',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        size: 'height',
        key: 'vertical',
        axis: 'Y',
        client: 'clientY',
        direction: 'top'
    },
    horizontal: {
        offset: 'offsetWidth',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        size: 'width',
        key: 'horizontal',
        axis: 'X',
        client: 'clientX',
        direction: 'left'
    }
};

function renderThumbStyle({ move, size, bar }) {
    const style = {};
    const translate = `translate${bar.axis}(${move}%)`;
    style[bar.size] = size;
    style.transform = translate;
    style.msTransform = translate;
    style.webkitTransform = translate;

    return style;
};

/* istanbul ignore next */
export default {
    name: 'Bar',

    props: {
        //  是否垂直滚动条
        vertical: Boolean,
        //  size 对应的是 水平滚动条的 width 或 垂直滚动条的height
        size: String,
        //  move 用于 translateX 或 translateY 属性中
        move: Number
    },

    computed: {
        /**
         * 从BAR_MAP中返回一个的新对象，垂直滚动条属性集合 或 水平滚动条属性集合
         */
        bar() {
            return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
        },
        //  父组件的wrap，用于鼠标拖动滚动块后更新 wrap 的 scrollTop 值
        wrap() {
            return this.$parent.wrap;
        }
    },

    render(h) {
        //  size: 'width' || 'height'
        //  move: 滚动块的位置，单位为百分比
        //  bar: 垂直滚动条属性集合 或 水平滚动条属性集合
        const { size, move, bar } = this;

        return (
            <div
                class={['el-scrollbar__bar', 'is-' + bar.key]}
                //  滚动条区域监听 鼠标按下事件
                onMousedown={this.clickTrackHandler} >
                <div
                    ref="thumb"
                    class="el-scrollbar__thumb"
                    //  滚动块监听 鼠标按下事件
                    onMousedown={this.clickThumbHandler}
                    style={renderThumbStyle({ size, move, bar })}>
                </div>
            </div>
        );
    },

    methods: {
//  按下滚动块
clickThumbHandler(e) {
    /**
     * 防止右键单击滚动块
     * e.ctrlKey: 检测事件发生时Ctrl键是否被按住了
     * e.button： 指示当事件被触发时哪个鼠标按键被点击 0，鼠标左键；1，鼠标中键；2，鼠标右键
     */
    if (e.ctrlKey || e.button === 2) {
        return;
    }
    //  开始记录拖拽
    this.startDrag(e);
    this['fuck'] = 1;
    //  记录当前点击位置距滚动块底部的距离
    this[this.bar.axis] = (
        //  滚动块的高度
        e.currentTarget[this.bar.offset] - 
        //  点击位置时距滚动块底部的距离
        (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])
    );
},
        //  对按下 滚动条区域 的某一个位置进行快速定位
        clickTrackHandler(e) {
            /**
             * getBoundingClientRect() 方法返回元素的大小及其相对于浏览器页面的位置。
             * this.bar.direction = "top"
             * this.bar.client = "clientY"
             * e.clientY 是事件触发时，鼠标指针相对于浏览器页面的垂直坐标。
             */

            //  偏移量            绝对值 （当前元素距离浏览器窗口的 垂直/水平 坐标     减去    当前点击的位置距离浏览器窗口的 垂直/水平 坐标）
            const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);

            //  滑动块一半高度
            const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
            //  计算点击后，根据 偏移量 计算在 滚动条区域的总高度 中的占比，也就是 滚动块 所处的位置
            const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
            //  设置外壳的 scrollHeight 或 scrollWidth 新值。达到滚动内容的效果
            this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
        },
        //  开始拖拽
        startDrag(e) {
            //  停止后续的相同事件函数执行
            e.stopImmediatePropagation();
            //  记录按下状态
            this.cursorDown = true;
            //  监听鼠标移动事件
            on(document, 'mousemove', this.mouseMoveDocumentHandler);
            //  监听鼠标按键松开事件
            on(document, 'mouseup', this.mouseUpDocumentHandler);
            //  拖拽滚动块时，此时禁止鼠标长按划过文本选中。
            document.onselectstart = () => false;
        },
        //  按下滚动条，并且鼠标移动时
        mouseMoveDocumentHandler(e) {
            //  如果按下状态为假，返回
            if (this.cursorDown === false) return;
            //  点击位置时距滚动块底部的距离
            const prevPage = this[this.bar.axis];
            
            if (!prevPage) return;

            //  鼠标移动的位置距离滚动条顶部的实际距离
            //  （滑块距离页面顶部的距离  减  鼠标移动时距离顶部的距离） * -1
            const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
            
            //  按下滑块位置距离滑块顶部的距离
            const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
            
            const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);
            this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
        },
    //  按下滚动条，并且鼠标松开
    mouseUpDocumentHandler(e) {
        //  重置按下状态
        this.cursorDown = false;
        //  重置当前点击在滚动块的位置
        this[this.bar.axis] = 0;
        //  移除监听鼠标移动事件
        off(document, 'mousemove', this.mouseMoveDocumentHandler);
        //  拖拽结束，此时允许鼠标长按划过文本选中。
        document.onselectstart = null;
    }
    },

    destroyed() {
        //  移除事件监听
        off(document, 'mouseup', this.mouseUpDocumentHandler);
    }
};

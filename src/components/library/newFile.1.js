/* __placeholder__ */
export default {
name: 'XtxInfiniteLoading',
props: {
loading: {
type: Boolean,
default: false
},
finished: {
type: Boolean,
default: false
} < temp,
setup(props, { emit }) {
const target = ref(null);
useIntersectionObserver(target, ([{ isIntersecting }]) => {
if (isIntersecting) {
// 关键：判断是否进入可视区
// 若loading为false，且finishedw为false，则emit触发父组件上的数据请求方法
if (!props.loading && !props.finished) {
emit('infinite');
}
}
}, { threshold: 0 }
);
return { target };
}, late
} >
<div class="xtx-infinite-loading" ref="container">
<div class="loading" v-if="loading">
<span class="img"></span>
<span class="text">正在加载...</span>
</div>
<div class="none" v-if="finished">
<span class="img"></span>
<span class="text">亲，没有更多了</span>
</div>
</div>,
template
} >

(<script>
import {ref} from 'vue'
import {useIntersectionObserver} from '@vueuse/core'
export default {name}: 'XtxInfiniteLoading',
props: {loading}: {type}: Boolean,
default: false
    },
finished: {type}: Boolean,
default: false
    }
  },
setup (props, {emit}) { }
const container = ref(null)
useIntersectionObserver(
container,
([{isIntersecting}], dom) => { }
if (isIntersecting) { }
if (props.loading === false && props.finished === false) {emit('infinite')}
        }
      },
{threshold}: 0
      }
)
return {container}
  }
}
</script>

,

<style scoped lang='less'>
.xtx-infinite-loading {
                    .loading} {display}: flex;
align-items: center;
justify-content: center;
height: 200px;
.img {width}: 50px;
height: 50px;
background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
.text {color}: #999;
font-size: 16px;
    }
  }
.none {display}: flex;
align-items: center;
justify-content: center;
height: 200px;
.img {width}: 200px;
height: 134px;
background: url(../../assets/images/none.png) no-repeat center / contain;
    }
.text {color}: #999;
font-size: 16px;
    }
  }
}
</style>);

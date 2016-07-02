<template>
  <div class = "timing">
    <h1>计时</h1>
    <div class = 'leaf'>
     <div class="tomato-leaf leaf1"></div>
     <div class="tomato-leaf leaf2"></div>
     <div class="tomato-leaf leaf3"></div>
      <div class="peduncle"></div>
    </div>
    <div class = "clock">
      <div class = 'pie zindex' v-bind:style="{transform:'rotate('+ clock.pie2+'deg)',background:clock.bgColor}"></div>
      <div class = "pie bg" v-bind:style="{transform:'rotate('+ clock.pie1+'deg)'}"></div>
      <div class="timenum"> {{time.min}}:{{time.sec}}</div>
    </div>
    <input type= "button" class="btn btn-primary btn-block" @click="startTiming" value="{{tomato}}"/>
    <div class = "settime">
      <input type="checkbox" id="checkbox" v-model="setting">
      <label for="checkbox">设置</label>
    </div>
    <div v-show = "setting">
      <div class="timechoose">
      工作时间：<input type = "number" value='25' v-model='time.workTime' min="15" max="60" >分钟
      </div>
      <div class="timechoose">
      休息时间：<input type = "number" value='5' v-model='time.restTime' max="20" min="0">分钟
      </div>
    </div>
    
  </div>
  <alert
  :show.sync="show.bool"
  :duration="4000"
  type="danger"
  width="400px"
  placement="top"
  dismissable>
  <span class="icon-info-circled alert-icon-float-left"></span>
  <p>{{show.content}}</p>
</alert>
</template>

<script>
import alert from 'vue-strap/src/alert'
import Notify from 'title-notify'
export default {
  data () {
    return {
      time: {
        sec: '00',
        min: '25',
        workTime: '25',
        restTime: '5'
      },
      timing: {
        isWorking: false,
        isTiming: false
      },
      tomato: '开始番茄',
      timeID: null,
      setting: false,
      doneTime: {
        startTime: '',
        endTime: ''
      },
      clock: {
        pie1: 0,
        pie2: 0,
        bgColor: '#fff',
        j: 0
      },
      show: {
        bool: false,
        content: ''
      },
      iNotify: new Notify({
        message: '有消息了。',
        effect: 'flash',
        audio: {
          // 可以使用数组传多种格式的声音文件
          file: ['http://7xqrzp.com1.z0.glb.clouddn.com/didi.mp3']
          // 下面也是可以的哦
          // file: 'msg.mp4'
        },
        notification: {
          title: '通知！', // 设置标题
          icon: '', // 设置图标 icon 默认为 Favicon
          body: '您来了一条新消息' // 设置消息内容
        }
      })
    }
  },
  components: {
    alert
  },
  methods: {
    startTiming () {
      // 点击按键后判断状态，执行相应任务
      if (this.timing.isTiming === false) {
        var date = new Date()
        this.doneTime.startTime = date.getHours() + ':' + this.addZero(date.getMinutes())
        if (this.time.workTime < 15 || this.time.workTime > 60 || this.time.workTime % 1 !== 0) {
          this.show.bool = true
          this.show.content = '工作时间请输入15~60分钟之间的整数'
          // window.alert('工作时间请输入15~60分钟之间的整数')
        } else if (this.time.restTime < 0 || this.time.restTime > 20 || this.time.restTime % 1 !== 0) {
          this.show.bool = true
          this.show.content = '休息时间请输入0~20分钟之间的整数'
          // window.alert('休息时间请输入0~20分钟之间的整数')
        } else {
          this.time.min = this.time.workTime
          this.timing.isWorking = true
          this.timing.isTiming = true
          this.tomato = '结束番茄'
          this.setting = false
          document.title = this.time.min + ':' + this.time.sec
          this.timeID = window.setTimeout(this.updateProgress, 1000)
        }
      } else {
        this.timing.isWorking = false
        this.timing.isTiming = false
        this.time.min = this.time.workTime
        this.time.sec = '00'
        this.tomato = '开始番茄'
        document.title = '番茄土豆'
        this.reset()
        window.clearTimeout(this.timeID)
      }
    },
    updateProgress () {
      var step = this.timing.isWorking ? 6 / this.time.workTime : 6 / this.time.restTime
      this.clock.j++
      this.clock.pie1 = step * this.clock.j
      if (this.clock.pie1 === 180) {
        this.clock.pie2 = 180
        this.clock.bgColor = '#F08080'
      }
      if (this.time.min !== '00' && this.time.sec === '00') {
        this.time.min = this.addZero(+this.time.min - 1)
        this.time.sec = '59'
        this.timeID = window.setTimeout(this.updateProgress, 1000)
        document.title = this.time.min + ':' + this.time.sec
      } else if (this.time.sec !== '00') {
        this.time.sec = this.addZero(this.time.sec - 1)
        document.title = this.time.min + ':' + this.time.sec
        this.timeID = window.setTimeout(this.updateProgress, 1000)
      } else {
        if (this.timing.isWorking === true) {
          this.reset()
          this.iNotify.player()
          this.iNotify.notify(
            {title: '时间到',
            body: '休息时间到啦'})
          // window.alert('休息时间到啦~')
          var date = new Date()
          this.doneTime.endTime = date.getHours() + ':' + this.addZero(date.getMinutes())
          this.$dispatch('hasDone', this.doneTime)
          this.time.min = this.addZero(this.time.restTime)
          document.title = this.time.min + ':' + this.time.sec
          this.timing.isWorking = false
          this.timeID = window.setTimeout(this.updateProgress, 1000)
        } else {
          this.tomato = '开始番茄'
          this.reset()
          this.iNotify.player()
          this.iNotify.notify(
            {title: '时间到',
            body: '点击"开始番茄"开始一个新番茄吧~'})
          // window.alert('点击"开始番茄"开始一个新番茄吧~')
          this.timing.isTiming = false
        }
      }
    },
    addZero (value) {
      if (value < 10) {
        value = '0' + value
      }
      return value + ''
    },
    reset () {
      this.clock.j = 0
      this.clock.pie1 = 0
      this.clock.pie2 = 0
      this.clock.bgColor = '#fff'
    }
  }
}
</script>

<style>
.leaf{
  position:relative;
  left:calc(50% - 60px);
}
.leaf .tomato-leaf {
   position:absolute;
   border-top-right-radius: 100%;
   border-bottom-left-radius: 100%;
   height: 55px;
     width: 20px;
      top: 10px;
      background:green;

}
.leaf .leaf1 {
  left:30px;
      transform:rotate(-40deg);
}
.leaf .leaf2 {
  left: 60px;
  top:0px;
    transform:rotate(50deg);
}
.leaf .leaf3 {
  left: 70px;
    transform:rotate(80deg);
}
.leaf .peduncle{
    position:absolute;
      border-radius: 20%;
     height: 50px;
     left: 50px;
     top: 0;
     width: 10px;
  background:green;
}
.clock{
  position:relative;
  font-size:54px;
  margin:64px auto 40px;
  border:8px solid #ccc;
  height:200px;
  width:200px;
  border-radius: 109px;
  box-shadow: 0 0 0 10px #ff6666;
}
.pie{  
    top:0;
    left:0;
    position:absolute;  
    width:184px;  
    height:184px;  
    border-radius:92px;  
    clip: rect(0px, 92px, 184px, 0px);
    transform:rotate(0deg);
}  

.bg {
     background:#F08080;  
     }
.zindex{
  z-index:1;
} 
.clock .timenum{
  position:absolute;
  z-index:2;
  text-align: center;
  line-height:184px;
  left:25px;
}
.settime{
  margin-top:10px;
}
.timing input[type="checkbox"] {
    position: absolute;
    clip: rect(0,0,0,0);
}
.timechoose{
  margin:10px 10px;
}
.timechoose >input[type="number"]{
 width:50px;
 margin-right:10px;
}

</style>